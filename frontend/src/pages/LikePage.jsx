import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Button,
  Avatar,
  HStack,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Link } from "@chakra-ui/layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Link as RouterLink } from "react-router-dom";

const LikePage = React.memo(() => {
  const { id } = useParams();
  const { ref, inView } = useInView();
  const [likesArray, setLikesArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const getLikes = async (props) => {
    setLoading(true);
    try {
      const reqbody = { page_count: props.pageParam };
      const token = localStorage.getItem("authToken");
      const request = await fetch(`/api/posts/getlikes/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqbody),
      });

      const response = await request.json();
      if (response.length === 0) {
        return;
      } else if (response.err) {
        console.log(response.err);
        return;
      }
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["likes"],
      queryFn: getLikes,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages?.length : undefined;
        return nextPage;
      },
    });
  const content = data?.pages;
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
      if (content?.length > 0) {
        setLikesArray([...likesArray, ...content]);
      }
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Flex w="full" alignItems={"flex-start"}>
      <Box w="full">
        {!loading &&
          likesArray.length > 0 &&
          likesArray?.map((items) =>
            items?.map((item) => (
              <Box key={item._id + "d"}>
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  py={4}
                  key={item._id + "Data"}
                >
                  <HStack gap="2">
                    <Avatar size="md" src={item.profile_picture} />
                    <VStack gap={0.2}>
                      <HStack>
                        <Link as={RouterLink} to={`/user/${item?._id}`}>
                          <Text
                            fontSize={"md"}
                            fontWeight={"bold"}
                            ml={3}
                            onClick={() => {}}
                          >
                            {item?.username}
                          </Text>
                        </Link>
                        <Image src="/verified.png" w={4} h={4} />
                      </HStack>

                      <Text color={"grey"} ml={-3}>
                        {item?.name}
                      </Text>
                    </VStack>
                  </HStack>
                </Flex>
                <hr style={{ marginLeft: "60px" }} />
              </Box>
            ))
          )}
        {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        <VStack py={4}>
          <Button
            variant={"ghost "}
            ref={ref}
            isDisabled={!hasNextPage || isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : likesArray.length>0?"No more Likes":"This Post has 0 likes"}
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
});

export default LikePage;
