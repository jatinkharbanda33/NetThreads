import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Avatar,
  HStack,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const LikePage = React.memo(() => {
  const { id } = useParams();
  const [likesArray, setLikesArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const getLikes = async (isInitialLoad = false) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const reqBody = { page_count: isInitialLoad ? 0 : page };
      const token = localStorage.getItem("authToken");
      const sendConfig={
        method:"POST",
        url:`/api/posts/getlikes/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:reqBody

      }
      const request = await axios(sendConfig)
      const response=request.data;

      if (response.err) {
        console.error(response.err);
        return;
      }
      const newItems = Array.isArray(response) ? response : [];
      setLikesArray((prevLikes) =>
        isInitialLoad ? newItems : [...prevLikes, ...newItems]
      );
      if (!isInitialLoad) setPage((prevPage) => prevPage + 1);

      // Check if there are more items to load
      setHasMore(newItems.length==30);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLikes(true); 
  }, []);

  return (
    <Flex w="full" alignItems={"flex-start"}>
      <Box w="full">
        {likesArray.length > 0 && (
          <InfiniteScroll
            dataLength={likesArray.length}
            next={getLikes}
            hasMore={hasMore}
            loader={<Spinner />}
            endMessage={
              <p style={{ textAlign: "center", padding: "20px 0" }}>
              <b>
                {likesArray.length === 0 ? "No Likes Yet" : "No More Likes"}
              </b>
            </p>
            }
          >
            {likesArray.map((item) => (
              <Box key={item._id + "d"}>
                <Flex
                  w={"full"}
                  justifyContent={"space-between"}
                  py={4}
                  key={item._id + "Data"}
                >
                  <HStack gap={2.5}>
                    <Avatar size="md" src={item.profile_picture} />
                    <VStack align="start" spacing={0.5}>
                      <HStack>
                        <Link as={RouterLink} to={`/user/${item?.user_id}`}>
                          <Text fontSize={"md"} fontWeight={"bold"}>
                            {item?.username}
                          </Text>
                        </Link>
                        
                          <Image src="/verified.png" w={4} h={4} />
                      
                      </HStack>
                      <Text color={"grey"}>{item?.name}</Text>
                    </VStack>
                  </HStack>
                </Flex>
                <hr style={{ marginLeft: "60px" }} />
              </Box>
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

export default LikePage;
