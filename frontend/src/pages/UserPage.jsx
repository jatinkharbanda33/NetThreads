import React, { useEffect, useState } from "react";
import UserHeader from '../components/UserHeader';
import { Flex,Spinner, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from '../components/Post';
import { Avatar, HStack, Text } from "@chakra-ui/react";
const UserPage = () => {
  let userposts = [];
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
const currentuser = useSelector((state) =>state.user);
  useEffect(() => {
    const getuserposts = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const request = await fetch(`/api/posts/getuserposts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        if (response.error) {
          console.log(response.error);
          return;
        }
        console.log(response);
        userposts=response;
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getuserposts();
  }, []);
  // if(!userId){
  //   return <h1> User Not Found</h1>;
  // }
  return (
    <>
    <UserHeader userId={userId}></UserHeader>
    {!loading && userposts.length===0 && <h1>User has no posts</h1>}
    {loading && (
      <Flex justifyContent={'center'} my={12}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    )}
    <HStack gap={"30px"}>
    <Avatar w={"120px"} h={"120px"}/>
    <VStack h={"100px"}>
    <Text fontSize={"x-large"} >{currentuser.name}</Text>
    <Text>{currentuser.bio}</Text>

    </VStack>

    </HStack>
    {userposts.map((post)=>{
      <Post post={post} />
    })}
    </>
  )
};


export default UserPage;
