// src/UpdateInfo.jsx
import React, { useState,useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, VStack, IconButton ,InputGroup,InputRightElement, HStack} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import {DevTool} from '@hookform/devtools'
let cnt=0;
const UpdateInfo = () => {
const user = useSelector((state) => state.user);
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
 const onSubmit = (data) => {
    console.log(data);
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
    <Box p={4}>
      <h1>Total Count {cnt/2}</h1>
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
          <Button onClick={toggleEdit} type="submit" colorScheme="blue">{isEditing?"Cancel":"Edit"}</Button>
          <Button type="submit" colorScheme="blue" isDisabled={!isEditing}>Update Information</Button>
          </HStack>
        </VStack>
      </form>
      <DevTool control={control} />
    </Box>
 );
};

export default UpdateInfo;
