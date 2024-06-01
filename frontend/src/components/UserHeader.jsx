import { Avatar } from "@chakra-ui/avatar";
import { Box, HStack, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { useSelector } from "react-redux";
import { Button, Input, Icon,Image,useColorMode, Spinner,Code } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import useFileUpload from "../hooks/use-File-Upload";
import ImageModal from "../modals/ImageModal";
import {toast} from 'sonner';
import axios from "axios";

const UserHeader = ({ user }) => {

  const [loading,setLoading] = useState(false);
  const currentuser = useSelector((state) => state.user);
  const { file, handleFileChange, filePreview, clearFile, setFilePreview } =
    useFileUpload();
    const { colorMode, toggleColorMode } = useColorMode();

  // useEffect(() => {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFilePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFilePreview(null);
  //   }
  // }, [file]);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast.success("Copied to Clipboard",currentURL);
    });
  };

  const changeProfilePicture = async () => {
    setLoading(true);
    try{
    if (!file) {
      console.log("No file");
      return;
    }
    const requestBody = {};
    if (file) {
      requestBody.file_name = file.name;
      requestBody.file_content_type = file.type;
      console.log(requestBody);
    }
      const token = localStorage.getItem("authToken");
      const sendConfig={
        method:"POST",
        url:`/api/users/update/profilepicture`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:requestBody

      }
      const request=await axios(sendConfig)
      const response=await request.data;
      console.log(response);

      if (response.error) {
        console.log(response.error);
        return;
      }
      if (!response.status) {
        console.log("error :400");
        return;
      }
      console.log(response.url);
      if (response.url) {
        await fetch(response.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file
        });
      }
    
    }
    catch(err){
      console.log(err);

    }
    finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    const getuserprofile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const request = await fetch(`/api/users/profile/${user}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        console.log(response);
        if (response.error) {
          console.log(response.error);
          return;
        }
        user = response;
        setisfollowing(response.isfollowing === 1 ? true : false);
      } catch (err) {
        console.log(err);
      }
    };
    getuserprofile();
  }, []);
  if (!user) return <h1>No user found</h1>;
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"} marginTop={'14'} paddingX={'6'}>
        <Box>
          <Text fontSize={"3xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"md"} color={"gray"}>~{user.username}</Text>
            <Code
              fontSize={"sm"}
              bg={"gray"}
              color={"white"}
              p={1}
              borderRadius={"full"}
            >
              netthreads
            </Code>
          </Flex>
        </Box>
        <Box  position={"relative"} display={"inline-block"}>
          {user.profilepicture && (
            <Avatar
              name={user.name}
              src={user.profilepicture}
              transition="opacity 0.2s"
              _hover={{  
                transform: "scale(1.2)",
                transition: "transform 0.5s ease-in-out"
              }}
              size={{
                base: "md",
                md: '2xl',
              }}
            />
          )}
          {!user.profilepicture && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {currentuser._id === user._id && (
            <Box>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <HStack gap={2} marginTop={4}>
                <Icon
                  as={FaEdit}
                  boxSize={6}
                  onClick={handleIconClick}
                  style={{ cursor: "pointer", border: "none", padding: 0 }}
                />
                {file && file!=null && (
                  <>
                      <ImageModal filePreview={filePreview} />
                      <Button onClick={changeProfilePicture}>Update</Button>
                  </>
                  
                )}
              </HStack>
            </Box>
          )}
        </Box>
      </Flex>

      {/* <Text>{user.bio}</Text> */}
      <Flex w={"full"} justifyContent={"left"} margin={6} gap={2}>
        {currentuser?._id === user._id && (
          <Link as={RouterLink} to="/user/updateinfo">
            <Button size={"sm"} 
            bg={colorMode == 'dark' ? 'white':'black'} 
            color={colorMode == 'dark' ? 'black' : 'white'} _hover={{bg : 'white', color: 'black'}}>Update Profile</Button>
          </Link>
        )}
        <Button
          bg={colorMode == 'dark' ? 'white':'black'} 
          color={colorMode == 'dark' ? 'black' : 'white'}
         size={"sm"} onClick={()=>{}} _hover={{bg : 'white', color: 'black'}}>Share Profile</Button>
      </Flex>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"} to="/">
            netthreads.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
          <Image
                  cursor={"pointer"}
                  alt="logo"
                  w={6}
                  src={
                    colorMode === "dark"
                      ? "/dark_n_new.png"
                      : "/light_n_new.png"
                  }
                />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> {user.name}'s Activity</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
