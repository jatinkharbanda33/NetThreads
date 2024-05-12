import React from "react";
import { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch} from "react-redux";
import { changeAuth } from "../redux/slices/authSlice";
import {  toast } from 'sonner'
const SignUpCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const handleSignUp = async () => {
    try {
      const request = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const response = await request.json();
      if (response.error) {
        console.log(response.error);
        toast.error('Invalid Inputs');
        return;
      }
      dispatch(changeAuth("login"));
      
    } catch (err) {
      console.log(err);
      toast.error('An unexpected Error Occurred');
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={16} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign Up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setInputs({ ...inputs, name: e.target.value });
                    }}
                    value={inputs.name}
                  ></Input>
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    value={inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
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
            <Button
             
              size="lg"
              bg={useColorModeValue("gray.600", "gray.700")}
              color={"white"}
              _hover={{
                bg: useColorModeValue("gray.700", "gray.800"),
              }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>
            <Text align={"center"}>
              Already a user?{" "}
              <Link
                color={"blue.400"}
                onClick={() => dispatch(changeAuth("login"))}
              >
                Login
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUpCard;
