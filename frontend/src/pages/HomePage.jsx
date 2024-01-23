import { Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePost } from "../redux/slices/postSlice";
import Post from "../components/Post";
const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const posts = useSelector((state) => state.post);
  const dispatch=useDispatch();
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
        console.log(response[0]['feedPosts']);
        dispatch(changePost(response[0]['feedPosts']));
        
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, []);
  return (
    <Flex gap="10" alignItems={"flex-start"} >
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <Flex justifyContent={"center"}>
            Follow Some users to see the feed
          </Flex>
        )}
        {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        {posts.map((post) => (
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
