import { Box, Flex, Spinner, Button, VStack } from "@chakra-ui/react";
import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePost } from "../redux/slices/postSlice";
import { useInView } from 'react-intersection-observer';
import Post from "../components/Post";

import { useInfiniteQuery } from "@tanstack/react-query";
import NewPost from "../components/NewPost";
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const posts = useSelector((state) => state.post);
  
  const dispatch = useDispatch();
  let currentuser = useSelector((state) => state.user);
  const { ref, inView } = useInView();

  const getFeedPosts = async (props) => {
    setLoading(true);
    try {
      const reqbody = { page_count: props.pageParam };
      const token = localStorage.getItem("authToken");
      const request = await fetch("/api/posts/feedposts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqbody),
      });
      const response = await request.json();
      if (response.error) {
        console.log(response.error);
        return;
      }
      if (response.length === 0) {
        return;
      }
     
      return response;
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posters"],
      queryFn: getFeedPosts,
      initialPageParam: 0, //page_count in future
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages?.length : undefined;
        return nextPage;
      },
    });
  const content = data?.pages;
  
  
  useEffect(() => {
    
    if(inView && hasNextPage){
      fetchNextPage();
      if(content?.length>0){
        const ans = content[content.length-1];
        console.log(ans);
        dispatch(changePost([...posts,...ans]));
      }
    }}, [inView,hasNextPage,fetchNextPage]);

  return (
    <Flex gap="10" alignItems={"flex-start"} overflow="hidden">
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
        {posts.length>0 &&
          posts.map((post) => (
            <Post key={post._id} post={post}  />
          ))
        }
        
        <VStack py={4}>
      <Button variant={"ghost "}
      ref={ref}
        isDisabled={!hasNextPage || isFetchingNextPage}
        onClick={() => {
          fetchNextPage();
        }}
      >
        {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "No more threads..."}
      </Button>
      </VStack>
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
