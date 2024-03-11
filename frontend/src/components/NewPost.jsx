import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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
  HStack
} from "@chakra-ui/react";
import { MdAttachment } from "react-icons/md";

const NewPost = () => {
  const [thread, setThread] = useState("");
  const [file, setFile] = useState(null);
  // let file;
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
    fileInputRef.current.value="";
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    
    setFile(e.target.files[0]);
  };
  

  return (
    <Flex direction={'column'}
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
          <Text px={4} fontSize={"md"} fontWeight={"bold"}>{currentuser?.username}</Text>
          <Input
            type="text"
            variant="unstyled"
            p={3}
            placeholder="Start a NetThread..."
            size="lg"
            focusBorderColor="grey"
            onChange={(e)=>{
              setThread(e.target.value)
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
              style={{ cursor: 'pointer', border: 'none', padding: 0 }}
              />
              {file && 
              <HStack padding={4}>
                <Text>{file.name}</Text>
                <ImCancelCircle cursor={"pointer"} onClick = {()=>{setFile(null)}}/>
              </HStack>
              }
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify={"space-between"} py={3} textColor={"gray"}>
        <Text>Anyone Can Reply</Text>

        <Button colorScheme="gray" rounded={"full"} w={"90px"} isDisabled={thread.length===0 && !file}>
          Post
        </Button>
      </Flex>
    </Flex>
  );
};

export default NewPost;
