import { Container, Box,Spinner,Flex } from "@chakra-ui/react";
import React, { Suspense, lazy } from "react";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { changeUser } from "./redux/slices/userSlice";
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LikePage = lazy(() => import("./pages/LikePage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const UserPage = lazy(() => import("./pages/UserPage"));

const App = React.memo(() => {
  let isUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        if (localStorage.getItem("authToken") && !isUser) {
          const token = localStorage.getItem("authToken");
          const req1 = await fetch("/api/users/getuser/token", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const res1 = await req1.json();
          if (res1.status == false) {
            localStorage.removeItem("authToken");
            return;
          }
          dispatch(changeUser(res1));
          isUser = res1;
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        console.log(err);
      }
    };
    if (!isUser && localStorage.getItem("authToken")) {
      getUser();
    }
    console.log("User");
  }, []);
  console.log("App renders");
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW="620px">
        <Header />
        <Suspense fallback={ <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>}>
          <Routes>
            <Route
              path="/"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <HomePage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/auth"
              element={!isUser ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route
              path="/post/likes/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <LikePage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/post/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <PostPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/user/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <UserPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
          </Routes>
        </Suspense>
      </Container>
    </Box>
  );
});
export default App;
