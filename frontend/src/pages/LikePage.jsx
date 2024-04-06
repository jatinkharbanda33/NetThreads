import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner,Text, Button, Avatar, HStack, Image, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from 'react-intersection-observer';

const LikePage = () => {
  const { id } = useParams();
  const { ref, inView } = useInView();
  const [loading, setLoading] = useState(true);
        const getLikes=async(props)=>{
            try{
              const reqbody = { page_count: props.pageParam };
              const token=localStorage.getItem("authToken");
              const request=await fetch(`/api/posts/getlikes/${id}`,{
                method:"POST",
                headers:{
                  Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
                },
                body: JSON.stringify(reqbody),
              });
              
              const response=await request.json();
              if(response.length===0){
               return;
              }
              else if(response.err){
                console.log(response.err);
                return;
              }
              
             return response;
            }
            catch(err){
                console.log(err);
            }
            finally{
                setLoading(false);
            }

        }

        

    
    
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["likes"],
      queryFn: getLikes,
      initialPageParam: 0, //page_count in future
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages?.length  : undefined;
        return nextPage;
      },
    });
    useEffect(() => {
    
    if(inView && hasNextPage){
      fetchNextPage();
    }}, [inView,hasNextPage]);

    const likesArray = data?.pages;
    console.log(likesArray);
    
  
 
  return (
    <Flex w="full" alignItems={"flex-start"} >
      <Box w="full">
      {!loading && likesArray.length === 0 && (
          <Flex justifyContent={"center"}>
            This Post has 0 likes
          </Flex>
        )}
        {!loading && likesArray.length>0 &&  likesArray?.map((items)=>
        items?.map((item)=>(
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
        )))}
        {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}

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
