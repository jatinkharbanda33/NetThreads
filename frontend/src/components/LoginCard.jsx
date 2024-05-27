import React from "react";
import { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { changeAuth } from "../redux/slices/authSlice";
import { changeUser } from "../redux/slices/userSlice";
import {  toast } from 'sonner'
import axios from "axios";


const LoginCard = () => {
  const dispatch = useDispatch();
  const [isError,setIsError]=useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin=async()=>{
    try{
      const sendConfig = {
        method: "POST",
        url: "/api/users/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: inputs,
      };
        const request=await axios(sendConfig)
        const response=await request.data;
        if(!response.status){
          setIsError(true);
          toast.error('Invalid Credentials')
          return;
        }
        toast.success("Logged In");
        setIsError(false);
        localStorage.setItem("authToken",response["token"]);
        dispatch(changeUser(response));
    }
    catch(err){
        console.log(err);
        toast.error('An unexpected Error Occurred');
    }
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={16} px={6}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Login
        </Heading>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                variant = "filled"
                focusBorderColor="grey"
                size="lg"

                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
                
              />
              
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputs.password}
                  variant = "filled"
                focusBorderColor="grey"
                size="lg"
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
           
            <Stack spacing={10} pt={2}>
              <Button
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
            
            <Stack pt={6}>
              <Text align={"center"}>
                Don&apos;t have an account?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => dispatch(changeAuth("signup"))}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
