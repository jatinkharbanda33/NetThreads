import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner,Text, Button, Avatar, HStack, Image, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
const LikePage = () => {
  const { id } = useParams();
  const [likesArray,setLikesArray]=useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    try{ 
        const getLikes=async()=>{
            try{
              const token=localStorage.getItem("authToken");
              const request=await fetch(`/api/posts/getlikes/${id}`,{
                method:"POST",
                headers:{
                  Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
                }
              });
              
              const response=await request.json();
              if(response.err){
                console.log(response.err);
                return;
              }
              setLikesArray(response);
              setLoading(false);
            }
            catch(err){
                console.log(err);
            }

        }
        getLikes();
        

    }
    catch(err){
        console.log(err);
        setLoading(false);
    }
  },[]);
  return (
    <Flex w="full" alignItems={"flex-start"} >
      <Box w="full">
      {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
      {!loading && likesArray.length === 0 && (
          <Flex justifyContent={"center"}>
            This Post has 0 likes
          </Flex>
        )}
        {!loading && likesArray.map((item)=>(
          <Box key={item._id + "d"}>

          <Flex w={"full"} justifyContent={"space-between"} py={4} key = {item._id + "Data"}>
              <HStack gap="2">
              <Avatar size="md" src={item.profile_picture} />
              <VStack gap={0.2}>
                <HStack>
              <Text fontSize={"md"} fontWeight={"bold"} ml={3} onClick={() => {}}>
                {item?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4}  />
                </HStack>

              <Text color={"grey"} ml={-3}>
                {item?.name}
              </Text>
              </VStack>
            </HStack>
          <Button variant={"outline"} rounded={"xl"} px={8}>Follow</Button>
          
          </Flex>
          <hr style={{marginLeft:"60px",}}/>
          </Box>
        ))}

      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      ></Box>
    </Flex>
  );
};

export default LikePage;
