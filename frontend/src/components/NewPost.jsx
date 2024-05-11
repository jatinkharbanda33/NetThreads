import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { Divider, useColorModeValue } from "@chakra-ui/react";
import { useFileUpload } from "../hooks/use-file-upload";
import ImageModal from "../modals/ImageModal";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Icon,
  HStack,
  Link,
} from "@chakra-ui/react";
import { MdAttachment } from "react-icons/md";

const NewPost = () => {
  const dividerColor = useColorModeValue("black", "gray.500");
  const [thread, setThread] = useState("");

  const { file, filePreview, handleFileChange, clearFile } = useFileUpload();

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
      const token = localStorage.getItem("authToken");
      const request = await fetch("/api/posts/createpost", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const response = await request.json();
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
          body: file,
        });
      }
      console.log("Here set Thread");
      // setFile(null);
      setThread("");
      // setFilePreview(null);
      clearFile();
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
          <Avatar name={currentuser?.name} src={currentuser.profilepicture} />
          <Flex direction={"column"}>
            <Link as={RouterLink} to={userPath}>
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
                {file && file != null && (
                  <ImageModal filePreview={filePreview} />
                )}
              </HStack>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          justify={"space-between"}
          alignItems={"center"}
          textColor={"gray"}
        >
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
      <Divider
        orientation="horizontal"
        borderColor={dividerColor}
        borderWidth="1px"
        mt={4}
        mb={4}
      />
    </>
  );
};

export default NewPost;
