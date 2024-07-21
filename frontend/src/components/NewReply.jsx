import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Divider, useColorModeValue } from "@chakra-ui/react";
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
import { toast } from "sonner";
import axios from "axios";
import useFileUpload from "../hooks/use-File-Upload";
import { useNavigate } from "react-router-dom";

const NewReply = (postId,nesting_level=0) => {
  const navigate=useNavigate();
  const dividerColor = useColorModeValue("black", "gray.500");
  const [thread, setThread] = useState("");
  const { file, filePreview, handleFileChange, clearFile } = useFileUpload();
  const handleReply = async () => {
    try {
      const requestBody = {};
      if (!thread && !file) {
        return;
      }
      if (thread) {
        requestBody.text = thread;
      }
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
        requestBody.parent_reply_id=postId;
        requestBody.nesting_level=nesting_level+1;
      }
      const token = localStorage.getItem('authToken');
      const sendConfig = {
        method: "POST",
        url: `${process.env.VITE_API_BASE_URL}/reply/create`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      };
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = await request.data;
      if (!response.status) {
        toast.error("An Error Occurred");
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
      setThread("");
      // setFilePreview(null);
      clearFile();
      toast.success("Reply Added");
    } catch (err) {
      toast.error("An Unexpected Error Occurred");
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
          <Avatar
            size="lg"
            name={currentuser?.name}
            src={currentuser?.profilepicture}
          />
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
            onClick={handleReply}
          >
            Reply
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

export default NewReply;
