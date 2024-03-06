import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { formatDistanceToNow, set } from "date-fns";
import { HStack, Spinner } from "@chakra-ui/react";
const LikePage = (post) => {
  let likesArray = [];
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    try{
        const getLikes=async()=>{
            try{

            }
            catch(err){
                console.log(err);
            }

        }

    }
    catch(err){
        console.log(err);
    }
  },[]);
  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
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

export default LikePage;
