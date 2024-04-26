import {Button, Flex, Link, Image, useColorMode,Avatar,Box, MenuButton,Menu, MenuItem,MenuList,useDisclosure,IconButton } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineSettings } from "react-icons/md";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { changeAuth } from "../redux/slices/authSlice";
import { AiFillHome } from "react-icons/ai";
import { changeUser } from "../redux/slices/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import react, {useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const HandleBack=()=>{
    navigate(-1);
  }
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const {  pathname } = location;
  const [loading, setLoading] = useState(true); 
  const user = useSelector((state) => state.user);
  let currenuserurl=user?`/user/${user._id}`:"/";
  useEffect(() => {
    
    if (user !== null) {
      setLoading(false);  
    }
  }, [user]);

  const handleLoginClick = () => {
    dispatch(changeAuth("login"));
  };
  const handleSignUpClick = () => {
    dispatch(changeAuth("signup"));
  };
  const handleLogout=async ()=>{
    try{
    const token=localStorage.getItem("authToken");
    const request=await fetch("/api/users/logout",{
      method:"POST",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type":"application/json",
      }

    });
    const response=await request.json();
    if(response.err){
      console.log(response.err);
      return
    }
    localStorage.removeItem("authToken");
    dispatch(changeUser(""));
    }
    catch(err){
      console.log(err);
    }

  }
  const changeTheme = () => {
    toggleColorMode();
  };
  if(loading) return null;
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={6}>
      {user && 
        pathname =='/'?
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>:
        <IoArrowBack size={24}  onClick={HandleBack}/>}
      
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={handleLoginClick}>
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={8}
        src={colorMode === "dark" ? "/light-logo.svg" :"/dark-logo.svg" }
        onClick={changeTheme}
      />
      {user && (
       <Flex alignItems="center" gap={4}>
       <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="left-start">
         <MenuButton as={IconButton}  icon={isOpen ? <FiX /> : <FiMenu />} />
         <MenuList>
           <MenuItem as={RouterLink} to={currenuserurl}>
             <Flex justifyContent="space-between" width="100%">
               <Box>Your Profile</Box>
               <Avatar name={user?.name} src="https://bit.ly/dan-abramov" size={'sm'} />
             </Flex>
           </MenuItem>
           <MenuItem  as={RouterLink} to={"/user/updateinfo"}>
             <Flex justifyContent="space-between" width="100%">
               <Box>Update Your Info</Box>
               <MdOutlineSettings size={20} />
             </Flex>
           </MenuItem>
           <MenuItem onClick={()=>{}}>
             <Flex justifyContent="space-between" width="100%">
               <Box>Change Theme</Box>
               {/* You can use any icon here for theme toggle */}
             </Flex>
           </MenuItem>
           <MenuItem onClick={handleLogout}>
             <Flex justifyContent="space-between" width="100%">
               <Box>Sign Out</Box>
               <FiLogOut size={20} />
             </Flex>
           </MenuItem>
         </MenuList>
       </Menu>
     </Flex>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={handleSignUpClick}>
          SignUp
        </Link>
      )}
    </Flex>
  );
};

export default Header;
