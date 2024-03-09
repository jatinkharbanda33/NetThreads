import React, { useEffect, useState } from 'react'
import Post from "../components/Post"
import { useParams } from "react-router-dom";
const PostPage = () => {
  const { id } = useParams();
  const [post,setPost]=useState(null);
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
      }
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
      }
      catch(err){
        console.log(err);
      }
    }
    getPost();
    getPostReplies()
  },[]);
  return (
    <>
     {post && <Post post={post} /> }
    </>
  )
}

export default PostPage