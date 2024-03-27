import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";

import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Icon,
  IconButton,
  HStack,Link,
} from "@chakra-ui/react";
import { MdAttachment } from "react-icons/md";

const NewPost = () => {
  const [thread, setThread] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [view, setView] = useState(false);

  const handlePost = async () => {
    try {
      const requestBody = {};
      if (!thread && !file) {
        console.log("Invalid request");
        return;
      }
      if (thread) {
        requestBody.text = thread;
      }
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
      }
      const token=localStorage.getItem("authToken");
      const request = await fetch("/api/posts/createpost", {
        method:"POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });
      const response=await request.json();
      console.log(response);

      if (response.error) {
        console.log(response.error);
        return;
      }
      if (!response.status) {
        console.log("error :400");
        return;
      }
      if (response.url) {
        await fetch(response.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file 
        });
      }
      setFile(null);
      setThread("");
      setFilePreview(null);
      setView(false);
    } catch (err) {
      console.log(err);
    }
  };

  const currentuser = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const userPath = `/user/${currentuser?._id}`;

  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
   
  };
  return (
    <>
    <Flex
      direction={"column"}
      p={3}
      rounded={"lg"}
      w={{
        base: "full",
        md: "600px",
      }}
    >
      <Flex direction={"row"}>
        <Avatar name={currentuser?.name} src="https://bit.ly/dan-abramov" />
        <Flex direction={"column"}>
          <Link as = {RouterLink} to={userPath}>
          <Text px={4} fontSize={"md"} fontWeight={"bold"}>
            {currentuser?.username}
          </Text>
          </Link>
          <Input
            type="text"
            variant="unstyled"
            p={3}
            placeholder="Start a NetThread..."
            size="lg"
            focusBorderColor="grey"
            onChange={(e) => {
              setThread(e.target.value);
            }}
          ></Input>
          <Flex px={3} justify={"space-between"} w={"140px"}>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <HStack gap={2}>
              <Icon
                as={MdAttachment}
                boxSize={5}
                onClick={handleIconClick}
                style={{ cursor: "pointer", border: "none", padding: 0 }}
              />
              {file && (
                <HStack padding={4}>
                  {!view ? (
                    <HStack>
                      <Text>{file.name}</Text>
                      <Button
                        colorScheme="gray"
                        style={{ width: "200px" }}
                        onClick={() => {
                          setView(true);
                        }}
                      >
                        View Attachment
                      </Button>
                      <ImCancelCircle
                    cursor={"pointer"}
                    style={{ width: "25px", height: "25px" }}
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      setView(false);
                    }}
                  />
                    </HStack>

                  ) : (
                    <Flex
                      position="fixed"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      zIndex="9999"
                    >
                      <Flex  gap={1} flexDirection={"column"} justifyContent={"center"}  style={{width:"100vh", height:"100vh", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>

                        <ImCancelCircle
                          cursor={"pointer"}
                          
                          style={{ width: "25px", height: "25px" }}
                          onClick={() => {
                            setView(false);
                          }}
                        />
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                        }}
                      />
                      </Flex>
                    </Flex>
                  )}
                </HStack>
              )}
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify={"space-between"} alignItems={"center"} textColor={"gray"}>
        <Text>Anyone Can Reply</Text>

        <Button
          colorScheme="gray"
          rounded={"full"}
          w={"90px"}
          isDisabled={thread.length === 0 && !file}
          onClick={handlePost}
        >
          Post
        </Button>
      </Flex>
    </Flex>
    <hr/>
    </>
  );
};

export default NewPost;