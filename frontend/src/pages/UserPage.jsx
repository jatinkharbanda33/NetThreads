import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { Button,VStack,Spinner,Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from "@tanstack/react-query";

const UserPage = React.memo( () => {
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  let URL = `/api/users/profile/${id}`;

  useEffect(() => {
    const getuser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        setLoading(true);
        const request = await fetch(URL, {
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

        setUserProfile(response);
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getuser();
  }, [URL]);

  const getuserposts = async (props) => {
    if (!id) return;

    try {
      const reqbody = { page_count: props.pageParam };
      const token = localStorage.getItem("authToken");
      setLoading(true);

      const request = await fetch(`/api/posts/getuserposts/${id}`, {
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
    } finally {
      setLoading(false);
    }
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: getuserposts,
      initialPageParam: 0, //page_count in future
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages?.length : undefined;
        return nextPage;
      },
    });
    useEffect(() => {
      
    if(inView && hasNextPage){
      fetchNextPage();
    }}, [inView,hasNextPage,fetchNextPage]);

  // if(!id){
  //   return <h1> User Not Found</h1>;
  // }
  const content = data?.pages;

  return (
    <>
     {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
      <UserHeader user={userProfile}></UserHeader>
      {!loading && content?.length === 0 && <h1>User has no posts</h1>}

      {!loading && content?.map((postarr) =>
        postarr?.map((post) => (
          <Post
            post={post}
            key={post._id}
            postname={userProfile?.username}
            profilepic={userProfile?.profilepicture}
          />
        ))
      )}
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
    </>
  );
});

export default UserPage;
