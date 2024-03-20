import React, { useEffect, useState } from "react";
import UserHeader from '../components/UserHeader';
import { Flex,Spinner} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Post from '../components/Post';

const UserPage = () => {
  const [userposts, setUserposts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

let URL = `/api/users/profile/${id}`;

useEffect(()=>{
  const getuser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      setLoading(true);
      
      const request = await fetch(URL, {
        method: "GET",
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
      
      setUserProfile(response);
    } catch (err) {
      
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  getuser();
},[URL]);
  useEffect(() => {
    const getuserposts = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("authToken");
        setLoading(true);
        
        const request = await fetch(`/api/posts/getuserposts/${id}`, {
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
        setUserposts(response);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getuserposts();
  }, [id]);
  // if(!id){
    //   return <h1> User Not Found</h1>;
    // }
    console.log("res",userProfile);
    return (
    <>
    <UserHeader user={userProfile}></UserHeader>
    {!loading && userposts.length===0 && <h1>User has no posts</h1>}
    {loading && (
      <Flex justifyContent={'center'} my={12}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    )}
   
   
    {!loading && userposts.map((post)=>(
      <Post post={post} key = {post._id} postname = {userProfile?.username} profilepic = {userProfile?.profilepicture} />
    ))}

   
    </>
  )
};


export default UserPage;
