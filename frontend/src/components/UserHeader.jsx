import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import {  useSelector } from "react-redux";
import { Button, Input, Icon} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";


const UserHeader = ({ user }) => {
  const currentuser = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  
  const fileInputRef = useRef(null);


  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
   
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    changeProfilePicture();

    
   
  };
  
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {});
  };
 
  const changeProfilePicture=async()=>{
    try{
      if(!file){
        console.log("No file");
        return;
      }
      const requestBody = {};
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
      }
      const token = localStorage.getItem("authToken");
      const request=await fetch(`/api/users/update/profilepicture`,{
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });
      const response=await request.json();
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
  }
  // useEffect(() => {
  //   const getuserprofile = async () => {
  //     try{
  //     const token = localStorage.getItem("authToken");
  //     const request = await fetch(`/api/users/profile/${user}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const response = await request.json();
  //     console.log(response);
  //     if (response.error) {
  //       console.log(response.error);
  //       return;
  //     }
  //     user=response;
  //     setisfollowing(response.isfollowing===1?true:false);
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  //   };
  //   getuserprofile();
    
  // }, []);
  if(!user) return  <h1>No user found</h1>;
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              netthreads
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilepicture && (
            <Avatar
              name={user.name}
              src={user.profilepicture}
              size={{
                base: "md",
                md: "xl",
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
          {
            currentuser._id === user._id && (

            <Box>

            
           <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          <Icon
                as={FaEdit}
                boxSize={5}
                onClick={handleIconClick}
                style={{ cursor: "pointer", border: "none", padding: 0 }}
              />
              </Box>
            )
          }

        </Box>
      </Flex>

      {/* <Text>{user.bio}</Text> */}

      {currentuser?._id === user._id && (
        <Link as={RouterLink} to="/user/updateinfo">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
         
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"} to="/">netthreads.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
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