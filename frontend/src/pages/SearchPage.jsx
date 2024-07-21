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
import { Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchPage = React.memo(() => {
  const navigate=useNavigate();
  const [searchArray, setSearchArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const getResults = async (isInitialLoad = false) => {
    if (!hasMore || loading || searchQuery.length == 0) return;

    setLoading(true);
    try {
      const reqBody = {
        lastFetchedId:
          searchArray.length > 0 ? searchArray[searchArray.length - 1]._id : 0,
        username: searchQuery,
      };
      const token = localStorage.getItem("authToken");
      const sendConfig = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/search/users`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: reqBody,
      };
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = request.data;

      if (response.err) {
        console.error(response.err);
        return;
      }
      const newItems = Array.isArray(response) ? response : [];
      setSearchArray((prevItems) =>
        isInitialLoad ? newItems : [...prevItems, ...newItems]
      );
      if (!isInitialLoad) setPage((prevPage) => prevPage + 1);

      // Check if there are more items to load
      console.log(newItems[0]);
      setHasMore(newItems.length == 30);
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
