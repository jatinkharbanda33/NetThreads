import React, { useEffect, useState } from 'react'
import Post from "../components/Post"
import Reply from '../components/Reply';
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import NewReply from '../components/NewReply';
const PostPage = () => {
  const { id } = useParams();
  const [post,setPost]=useState(null);
  const [loading,setLoading]=useState(true);
  const [postReplies,setPostReplies]=useState([]);
  useEffect(()=>{
    const getPost=async()=>{
      try{
        const token=localStorage.getItem("authToken");
        const request=await fetch(`/api/posts/getpost/${id}`,{
          method:"POST",
          headers:{
            Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
          }
        });
        
        const response=await request.json();
        if(!response.status){
          console.log(response.error);
          return;
        }
        setPost(response.result);
      }
      catch(err){
        console.log(err);
        setLoading(false);
      }
      console.log("PostPage");
    }
    const getPostReplies=async()=>{
      try{
        const token=localStorage.getItem("authToken");
        const request=await fetch(`/api/posts/getreplies/${id}`,{
          method:"POST",
          headers:{
            Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
          }
        });
        
        const response=await request.json();
        if(!response.status){
          console.log(response.error);
          return;
        }
        setPostReplies(response.result);
        setLoading(false);
      }
      catch(err){
        console.log(err);
        setLoading(false);
      }
    }
    getPost();
    getPostReplies()
  },[]);
  return (
    <>
    {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        {!loading && post &&<> <Post post={post} key={`/post/${post._id}`} />  <NewReply key={id} postId={id} /> </>}
       
     {!loading && postReplies.map((reply)=>(<Reply key = {reply._id} reply={reply}/>))}
    
    </>
  )
}

export default PostPage