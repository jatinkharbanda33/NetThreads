import { Container ,Box} from "@chakra-ui/react";
import Header from "./components/Header";
import {Navigate,Route,Routes} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useEffect } from "react";
import { changeUser } from "./redux/slices/userSlice";
import LikePage from "./pages/LikePage";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
function App() {
  let isUser=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  useEffect(()=>{
    const getUser=async()=>{
    try{
      if(localStorage.getItem("authToken") && !isUser){
        const token=localStorage.getItem("authToken");
        const req1=await fetch("/api/users/getuser/token",{
          method:"POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const res1=await req1.json();
        if(res1.status==false){
          localStorage.removeItem("authToken");
          return;
        }
        dispatch(changeUser(res1));
        isUser=res1;
      }

    }
    catch(err){
      localStorage.removeItem("authToken");
      console.log(err);
    }
  }
  getUser();
  },[])
  return (
    <Box position={"relative"} w={'full'} >
      <Container maxW='620px'>
        <Header />
        <Routes>
          <Route path='/' element={isUser || localStorage.getItem("authToken") ? <HomePage /> :<Navigate to="/auth" />} />
          <Route path='/auth' element={!isUser ? <AuthPage />: <Navigate to="/" />} />
          <Route path='/post/likes/:id' element={isUser || localStorage.getItem("authToken") ? <LikePage />:<Navigate to="/auth" />}></Route>
          <Route path='/post/:id' element={isUser || localStorage.getItem("authToken")?<PostPage />:<Navigate to="/auth" />}></Route>
          <Route path='/user/:id' element={isUser || localStorage.getItem("authToken")?<UserPage />:<Navigate to="/auth" />}></Route>
        </Routes>
        </Container>
    </Box>
  );
}

export default App;
