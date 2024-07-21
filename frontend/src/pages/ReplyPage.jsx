import React, { useEffect, useState } from 'react'
import Reply from '../components/Reply';
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import NewReply from '../components/NewReply';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ReplyPage = React.memo( () => {
  const navigate=useNavigate();
  const { id } = useParams();
  const [reply,setReply]=useState(null);
  const [loading,setLoading]=useState(true);
  const [postReplies,setPostReplies]=useState([]);
  useEffect(()=>{
    const getReply=async()=>{
      try{
        const token= localStorage.getItem('authToken');
        const sendConfig={
          method:"POST",
          url:`${import.meta.env.VITE_API_BASE_URL}/reply/get/${id}`,
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
        setReply(response.result);
      }
      catch(err){
        console.log(err);
        setLoading(false);
      }

    }
    const getPostReplies=async()=>{
      try{
        const token= localStorage.getItem('authToken');
        const reqBody={
          parent_reply_id:id,
          lastFetchedId:postReplies.length>0? postReplies[postReplies.length-1]:0
        }
        const sendConfig={
          method:"POST",
          url:`${import.meta.env.VITE_API_BASE_URL}/reply/replies`,
          headers:{
            Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
          },
          data:reqBody
        }
        const request=await axios(sendConfig)
        if(request.status==401) navigate("/");
        const response=await request.data;
        if(!response.status){
          console.log(response.error);
          return;
        }
        setPostReplies(response.data);
        setLoading(false);
      }
      catch(err){
        console.log(err);
        setLoading(false);
      }
    }
    getReply();
    getPostReplies()
  },[]);
  return (
    <>
    {loading && (
          <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>
        )}
        {!loading && reply &&<> <Reply reply={reply} key={`/reply/${reply._id}`} />  <NewReply key={id} postId={reply._id} nesting_level={1} /> </>}
       
     {!loading && postReplies.map((reply)=>(<Reply key = {reply._id} reply={reply}/>))}
    
    </>
  )
})

export default ReplyPage