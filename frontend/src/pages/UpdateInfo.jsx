// src/UpdateInfo.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, VStack, InputGroup, HStack,Flex,Spinner} from '@chakra-ui/react';
import { useSelector,useDispatch } from 'react-redux';
import { changeUsername,changeName } from "../redux/slices/userSlice";
import {  toast } from 'sonner'
import axios from 'axios';
let cnt=0;
const UpdateInfo = () => {
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch();
const user = useSelector((state) => state.user);
console.log(user);
 const { register,control, handleSubmit, setValue, formState: { errors } } = useForm(
  {
    defaultValues:{
      name:user?.name,
      username:user?.username
    }
  }
 );
 cnt++;
 const [isEditing, setIsEditing] = useState(false);
 const onSubmit = async(data) =>{try {
  setLoading(true);
  const bodyFields={
    username:data.username,
    name:data.name
  }
  console.log(bodyFields);
  const token = localStorage.getItem("authToken");
  const sendConfig={
    method:"POST",
    url:"/api/users/update/userDetails",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data:bodyFields
  }
  const request = await axios(sendConfig)

  const response = await request.data;
  
  if (!response.status) {
    toast.error(response?.error);
    return;
  }
  console.log(response.message);
  dispatch(changeUsername(bodyFields.username));
  dispatch(changeName(bodyFields.name));
  setIsEditing(false);
  toast.success(response?.message);
    
 }
 catch(err){
  console.log(err.message);
  toast.error("An Error Occurred");
 }
 finally{
  setLoading(false);
 }
};
 const toggleEdit = ()=>{
  if(isEditing){
   setValue('name',user?.name);
    setValue('username',user?.username);
    setIsEditing(false);
  }
  else{
    setIsEditing(true);
  }
 }
 return (
  <>
  {loading && <Flex justify={"center"} align={"center"} py={"30px"}>
      <Spinner size="xl"></Spinner>
    </Flex>
  }
  {!loading && 
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <InputGroup>
              <Input {...register("name")} isDisabled={!isEditing} />
            </InputGroup>
          </FormControl>

          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <Input {...register("username")} isDisabled={!isEditing} />
            </InputGroup>
          </FormControl>
          <HStack gap={2}>
          <Button onClick={toggleEdit}colorScheme="blue">{isEditing?"Cancel":"Edit"}</Button>
          <Button type="submit" colorScheme="blue" isDisabled={!isEditing}>Update Information</Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  }
</>)
};

export default UpdateInfo;
