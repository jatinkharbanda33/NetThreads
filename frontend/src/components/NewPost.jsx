import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { ImImages } from "react-icons/im";
import { PiGifFill } from "react-icons/pi";
import { FaHashtag } from "react-icons/fa6";

const NewPost = () => {
  let file;
  const [selectedFile, setSelectedFile] = useState();
  const handlePost = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      if(file){
        formData.append("my_file", file);
      }

      const response = await axios.post("/api/posts/createpost", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      
      if (response.error) {
        console.log(response.error);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }; 
  const currentuser = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    console
    file = e.target.files[0];
  };

  return (
    <Box
      p={3}
      rounded={"lg"}
      w={{
        base: "full",
        sm: "600px",
      }}
    >
      <Flex direction={"row"}>
        <Avatar name={currentuser?.name} src="https://bit.ly/dan-abramov" />
        <Flex direction={"column"}>
          <Text px={4}>{currentuser?.username}</Text>
          <Input
            type="text"
            variant="unstyled"
            p={3}
            placeholder="Start a NetThread..."
            size="lg"
            focusBorderColor="grey"
          ></Input>
          <Flex px={3} justify={"space-between"} w={"140px"}>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Icon
              as={ImImages}
              boxSize={5}
              onClick={handleIconClick}
              style={{ cursor: 'pointer', border: 'none', padding: 0 }}
            />
            <Icon as={PiGifFill} boxSize={5} />
            <Icon as={FaHashtag} boxSize={5} />
            <Icon as={MdSettings} boxSize={5} />
          </Flex>
        </Flex>
      </Flex>
      <Flex justify={"space-between"} py={6} textColor={"gray"}>
        <Text>Anyone Can Reply</Text>

        <Button colorScheme="gray" rounded={"full"} w={"90px"}>
          Post
        </Button>
      </Flex>
    </Box>
  );
};

export default NewPost;
