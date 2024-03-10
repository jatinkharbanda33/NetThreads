import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { HStack, Spinner, Link } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updatePost } from "../redux/slices/postSlice";

const Reply = ({ reply }) => {
  /* let postpath=String(`/post/${post._id}`); */
  /* let likespath=String(`/post/likes/${post._id}`); */
   const [isLiked, setLike] = useState(false);
   const [likesCount,setLikesCount]=useState(reply.likesCount); 
   const toggleLike = async () => {
    try {
      if(isLiked){
        setLike(!isLiked);
       setLikesCount(likesCount-1);
      }
      else{
        setLike(!isLiked);
        setLikesCount(likesCount+1);

      }
      const token = localStorage.getItem("authToken");

      let payload={
        replyId:reply._id
      }
      const request = await fetch(`/api/posts/likereply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(payload)
      });
      const response = await request.json();
     
      if (!response.status) {
        console.log(response.error);
        return;
      }
      
      if(isLiked){
      reply={...reply,likesCount:reply.likesCount-1};
      }
      else{
        reply={...reply,likesCount:reply.likesCount+1};

      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const isLiked = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const request = await fetch(`/api/posts/isliked/reply/${reply._id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          
        });
        const response = await request.json();
        if (!response.status) {
          return;
        }
        setLike(response['answer']);
      } catch (err) {
        console.log(err);
      }
    };
    isLiked();
  }, []);
  // function formatTimestamp(timestamp) {
  //   const now = new Date();
  //   const diff = now.getTime() - new Date(timestamp).getTime();
  //   const seconds = Math.floor(diff / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);
  //   const days = Math.floor(hours / 24);

  //   if (seconds < 60) {
  //      return seconds + "s";
  //   } else if (minutes < 60) {
  //      return minutes + "m";
  //   } else if (hours <= 48) {
  //      return hours + "h";
  //   } else {
  //      return days + "d";
  //   }
  //  }

  return (
    <Flex
      flex={1}
      key={reply._id}
      gap={2}
      justifyContent={"center"}
      alignContent={"center"}
      w={"99%"}
      padding={5}
    >
      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <HStack gap="2">
              <Avatar size="xs" src="https://bit.ly/broken-link" />
              <Text fontSize={"md"} fontWeight={"bold"} onClick={() => {}}>
                {reply?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </HStack>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {"56d"}
            </Text>
          </Flex>
        </Flex>
        {/* <Link as={RouterLink} to={postpath}> */}
        <Text fontSize={"md"}>{reply.text}</Text>
        {
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            {<Image src={reply.image} w={"full"} alt="err" />}
          </Box>
        }
          <HStack gap={2}>
          {isLiked && <FaHeart color="red" onClick={toggleLike} size={18}  />}
          {!isLiked && <FaRegHeart onClick={toggleLike} size={18} />}
        </HStack>
        {/* <Link as={RouterLink} to={likespath}> */}
        <Text>{likesCount} likes</Text>
        <hr />
      </Flex>
    </Flex>
  );
};

export default Reply;
