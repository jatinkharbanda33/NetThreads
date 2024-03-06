import React from 'react'
import { useSelector } from 'react-redux';
import { 
    Box,
    Flex,
    Input,
    Button,
    Text,
    Avatar,
    Icon
 } from '@chakra-ui/react'
 import {MdSettings} from 'react-icons/md'
 import { ImImages } from "react-icons/im";
 import { PiGifFill } from "react-icons/pi";
 import { FaHashtag } from "react-icons/fa6";

const NewPost = () => {
    const handlePost=async()=>{
        try{
          const token=localStorage.getItem("authToken");
          const request=await fetch("/api/posts/createpost",{
            method:"POST",
            headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            },
            body:JSON.stringify(inputs),
          });
          const response=await request.json();
          if(response.error){
            console.log(response.error);
            return;
          }
        }
        catch(err){
            console.log(err);
        }
    }
    const currentuser=useSelector((state)=>state.user);
  return (
    <Box 
    p={5}
    
    rounded={"lg"}
    w={{
      base: "full",
      sm:"600px"
      
    }}>
        <Flex direction={"row"}>

        <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
           <Flex direction={"column"}>
           <Text px={4} >
                {currentuser?.username}
            </Text>
        <Input
        type="text"
        
        variant="unstyled"
        p={3}
        
        placeholder="Start a Thread..."
        size="lg"
        focusBorderColor="grey">

        </Input>
        <Flex px={3} justify={"space-between"} w={"140px"} >
        <Icon as={ImImages} boxSize={5}/>
        <Icon as={PiGifFill} boxSize={5}/>
        <Icon as={FaHashtag} boxSize={5}/>
        <Icon as={MdSettings} boxSize={5}/>

        </Flex>
           </Flex>
        </Flex>
        <Flex justify={"space-between"} py={6} textColor={"gray"}>
            <Text>Anyone Can Reply</Text>

        <Button colorScheme='gray' rounded={"full"} w={"90px"} >Post</Button>
        </Flex>
       
      
      
    </Box>
  )
}

export default NewPost