import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import { FaRegHeart,FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { HStack } from "@chakra-ui/react";


const Post = ({ post }) => {
  const [isLiked,setLike]=useState(false);
  useEffect(()=>{
    const getLike=async()=>{
      try{

      }
      catch(err){

      }
    }
    getLike();

  },[])
  return (
    <Link>
      <Flex flex={1} flexDirection={"column"} gap={2} padding={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <HStack gap='2'>
          <Avatar size='xs' src='https://bit.ly/broken-link' />
            <Text fontSize={"sm"} fontWeight={"bold"} onClick={() => {}}>
              {post?.postedByUserName}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
            </HStack>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(post.timestamps))} ago
            </Text>
            {/* 
            {currentUser?._id === user._id && (
              <DeleteIcon size={20} onClick={handleDeletePost} />
            )} */}
          </Flex>
        </Flex>
        <Text fontSize={"sm"}>{post.text}</Text>
        {post.image && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={post.image}  w={"full"} />
          </Box>
        )}
        <HStack gap={2}>
        <FaRegHeart />
        <FaRegComment />

        </HStack>
        <HStack gap={2}>
            <Text>{post.likesCount} likes</Text>
            <Text>{post.repliesCount} replies</Text>
        </HStack>
      </Flex>
    </Link>
  );
};

export default Post;
