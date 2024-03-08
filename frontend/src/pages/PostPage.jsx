import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const PostPage = () => {
  const { id } = useParams();
  const [post,setPost]=useState(null);
  useEffect(()=>{
    const getPost=async()=>{
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
  },[]);
  return (
    <Post key={post._id} post={post} ></Post>
  )
}

export default PostPage