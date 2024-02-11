import React, { useEffect, useState } from "react";
import UserHeader from '../components/UserHeader';
import { Flex,Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Post from '../components/Post';
const UserPage = () => {
  let userposts = [];
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
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
  if(!userId){
    return <h1> User Not Found</h1>;
  }
  return (
    <>
    <UserHeader userId={userId}></UserHeader>
    {!loading && userposts.length===0 && <h1>User has no posts</h1>}
    {loading && (
      <Flex justifyContent={'center'} my={12}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    )}
    {userposts.map((post)=>{
      <Post post={post} />
    })}
    </>
  )
};


export default UserPage;
