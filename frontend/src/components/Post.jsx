import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { HStack, Spinner,Link } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updatePost } from "../redux/slices/postSlice";

const Post = ({ post }) => {
  let dispatch=useDispatch();
  let postpath=String(`/post/${post._id}`);
  let likespath=String(`/post/likes/${post._id}`);
  const [isLiked, setLike] = useState(false);
  const [likesCount,setLikesCount]=useState(post.likesCount);
  const [repliesCount,setrepliesCount]=useState(post.repliesCount);
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
      const request = await fetch(`/api/posts/likepost/${post._id}`, {
        method: "POST",
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
      
      if(isLiked){
      let newpost={...post,likesCount:post.likesCount-1};
      dispatch(updatePost(newpost));
      }
      else{
        let newpost={...post,likesCount:post.likesCount+1};
      dispatch(updatePost(newpost));

      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const isLiked = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const request = await fetch(`/api/posts/isliked/${post._id}`, {
          method: "POST",
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
        setLike(response['answer']);
      } catch (err) {
        console.log(err);
      }
    };
    isLiked();
  }, []);
  function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
   
    if (seconds < 60) {
       return seconds + "s";
    } else if (minutes < 60) {
       return minutes + "m";
    } else if (hours <= 48) {
       return hours + "h";
    } else {
       return days + "d";
    }
   }
  return (
      <Flex flex={1} flexDirection={"column"} gap={2} padding={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <HStack gap="2">
              <Avatar size="xs" src="https://bit.ly/broken-link" />
              <Text fontSize={"md"} fontWeight={"bold"} onClick={() => {}}>
                {post?.username}
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
              {formatTimestamp(post.timestamps)}
            </Text>
          </Flex>
        </Flex>
        <Link as={RouterLink} to={postpath} style={{ textDecoration: 'none'}}>
        <Text fontSize={"md"}>{post.text}</Text>
        {post.image && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={post.image} w={"full"} />
          </Box>
        )}
        </Link >
        <HStack gap={2}>
          {isLiked && <FaHeart color="red" onClick={toggleLike} size={18}  />}
          {!isLiked && <FaRegHeart onClick={toggleLike} size={18} />}
          <FaRegComment size={18}  />
        </HStack>
        <HStack gap={2}>
          <Link as={RouterLink} to={likespath}>
          <Text>{likesCount} likes</Text>
          </Link>
          <Text>{repliesCount} replies</Text>
        </HStack>
        <hr/>
      </Flex>
  );
};

export default Post;
