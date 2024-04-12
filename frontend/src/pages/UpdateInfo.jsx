// src/UpdateInfo.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, VStack, IconButton ,InputGroup,InputRightElement} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';


const UpdateInfo = () => {
  const user = useSelector((state) => state.user);
 const { register, handleSubmit, setValue, formState: { errors } } = useForm(
  {
    defaultValues:{
      name:user?.name,
      username:user?.username
    }
  }
 );
 const [isEditing, setIsEditing] = useState({ name: false, username: false });

 const onSubmit = (data) => {
    console.log(data);
    // Handle form submission, e.g., send data to an API
 };

 const toggleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
 };

 return (
    <Box p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <InputGroup>
              <Input {...register("name")} isDisabled={!isEditing.name} />
              <InputRightElement>
                <IconButton
                 aria-label="Edit Name"
                 icon={<EditIcon />}
                 onClick={() => toggleEdit('name')}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <InputGroup>
              <Input {...register("username")} isDisabled={!isEditing.username} />
              <InputRightElement>
                <IconButton
                 aria-label="Edit Username"
                 icon={<EditIcon />}
                 onClick={() => toggleEdit('username')}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button type="submit" colorScheme="blue">Update Information</Button>
        </VStack>
      </form>
    </Box>
 );
};

export default UpdateInfo;
