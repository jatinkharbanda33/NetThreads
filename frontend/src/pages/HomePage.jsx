import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePost } from "../redux/slices/postSlice";
import Post from "../components/Post";
import { changeUser } from "../redux/slices/userSlice";
import NewPost from "../components/NewPost";
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const posts = useSelector((state) => state.post);
  const dispatch=useDispatch();
  let currentuser=useSelector((state)=>state.user);
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const request = await fetch("/api/posts/feedposts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response=await request.json();
        if(response.error){
          console.log(response.error);
          return;
        }
        dispatch(changePost(response));
        setLoading(false);
        
      } catch (err) {
        console.log(err);
        setLoading(false);
      } 
    };
    getFeedPosts();
  }, []);
  return (
    <Flex gap="10" 
     alignItems={"flex-start"} overflow="hidden">
      <Box flex={70} style={{ width: "100%" }}>
        <NewPost />
        {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        {!loading && posts.length === 0 && (
          <Flex justifyContent={"center"}>
            Follow Some users to see the feed
          </Flex>
        )}
        {!loading && posts.map((post) => (
					<Post key={post._id} post={post}  />
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

export default HomePage;
