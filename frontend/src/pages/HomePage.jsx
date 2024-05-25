import { Box, Flex, Spinner, Button, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePost } from "../redux/slices/postSlice";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import NewPost from "../components/NewPost";

const HomePage = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const posts = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const getFeedPosts = async (isInitialLoad = false) => {
    if (loading ||!hasMore) return;
    setLoading(true);
    try {
      const reqBody = { page_count: page };
      const token = localStorage.getItem("authToken");
      const request = await fetch("/api/posts/feedposts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      const response = await request.json();
      if (response.error) {
        console.log(response.error);
        return;
      }
      console.log(response);
      if (isInitialLoad) {
        dispatch(changePost(response)); 
      } else {
        const newPosts=[...posts,...response];
        dispatch(changePost(newPosts));
        setPage(prev => prev + 1);
      }
      setHasMore(response.length === 30);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
   if(posts.length==0){
      getFeedPosts(true); 
   }
    
  }, []);

  return (
    <Flex gap="10" alignItems={"flex-start"} overflow="hidden">
      <Box flex={70} style={{ width: "100%" }}>
        <NewPost />
        {posts.length > 0 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={() => getFeedPosts()} // Ensuring the correct function signature
            hasMore={hasMore}
            loader={<Flex justify={"center"} align={"center"} py={"20px"}>
              <Spinner size="xl" />
            </Flex>}
            endMessage={
              <Flex justifyContent={'center'} py={'20px'}>
                <b>
                  {posts.length === 0? "No Posts Yet" : "No More Posts"}
                </b>
              </Flex>
            }
          >
            {posts.map((post) => (
              <Post key={`/home/post/${post._id}`} post={post} />
            ))}
          </InfiniteScroll>
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
});

export default HomePage;
