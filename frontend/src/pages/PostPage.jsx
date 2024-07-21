import React, { useEffect, useState } from 'react'
import Post from "../components/Post"
import Reply from '../components/Reply';
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import NewReply from '../components/NewReply';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const PostPage = React.memo( () => {
  const navigate=useNavigate();
  const { id } = useParams();
  const [post,setPost]=useState(null);
  const [loading,setLoading]=useState(true);
  const [postReplies,setPostReplies]=useState([]);
  useEffect(()=>{
    const getPost=async()=>{
      try{
        const token= localStorage.getItem('authToken');
        const sendConfig={
          method:"POST",
          url:`${import.meta.env.VITE_API_BASE_URL}/posts/get/${id}`,
          headers:{
            Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
          }

        }
        const request=await axios(sendConfig)
        if(request.status==401) navigate("/");
        const response=await request.data;
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
        const token= localStorage.getItem('authToken');
        const sendConfig={
          method:"POST",
          url:`${import.meta.env.VITE_API_BASE_URL}/reply/get/replies`,
          headers:{
            Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
          },
          data:{
            parent_reply_id:id,
            lastFetchedId:postReplies.length>0? postReplies[postReplies.length-1]:0
          }
        }
        const request=await axios(sendConfig)
        if(request.status==401) navigate("/");
        const response=await request.data;
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
})

export default PostPage