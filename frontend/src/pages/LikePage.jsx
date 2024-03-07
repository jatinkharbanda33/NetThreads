import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner,Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
const LikePage = () => {
  const { id } = useParams();
  const [likesArray,setLikesArray]=useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setLoading(true);
    try{ 
        const getLikes=async()=>{
            try{
              const token=localStorage.getItem("authToken");
              const request=await fetch(`/api/posts/getlikes/${id}`,{
                method:"POST",
                headers:{
                  Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
                }
              });
              
              const response=await request.json();
              if(response.err){
                console.log(response.err);
                return;
              }
              setLikesArray(response);
            }
            catch(err){
                console.log(err);
            }

        }
        getLikes();
        setLoading(false);

    }
    catch(err){
        console.log(err);
        setLoading(false);
    }
  },[]);
  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
      {!loading && likesArray.length === 0 && (
          <Flex justifyContent={"center"}>
            This Post has 0 likes
          </Flex>
        )}
        {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        {!loading && likesArray.map((item)=>(
          <Text key={item._id}>{item.username}</Text>
        ))}

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
