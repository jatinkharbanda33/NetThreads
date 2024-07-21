import { Container, Box, Spinner, Flex, useColorMode } from "@chakra-ui/react";
import React, { Suspense, lazy } from "react";
import Header from "./components/Header";
import { Navigate, Route, Routes ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState} from "react";
import { changeUser } from "./redux/slices/userSlice";
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LikePage = lazy(() => import("./pages/LikePage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const UpdateInfo = lazy(() => import("./pages/UpdateInfo"));
import { Toaster } from "sonner";
import axios from "axios";
const App = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate=useNavigate();
  let isUser = useSelector((state) => state.user);
  const authToken=localStorage.getItem('authToken');
  const dispatch = useDispatch();
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const sendConfig = {
          method: "GET",
          url: "/api/users/refresh/token",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };
        const request = await axios(sendConfig);
        const response = await request.data;
        if (request.status == false) {
          return;
        }
        localStorage.setItem("authToken", response.authToken);
        window.location.reload();
        isUser = response;
      } catch (err) {
        return;
      }
    };
    const getUser = async () => {
      try {
        if (authToken && !isUser) {
          const token = localStorage.getItem("authToken");
          console.log(token);
          const sendConfig = {
            method: "POST",
            url: "/api/users/getuser/token",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
          const request = await axios(sendConfig);
          const response = await request.data;
          if (request.status == false) {
            return;
          }
          dispatch(changeUser(response));
          isUser = response;
        }
      } catch (err) {
        localStorage.removeItem("authToken");
      }
    };
    if (!isUser && authToken ) {
      console.log(authToken);
      getUser();
    }
    if (!authToken) {
      refreshToken();
    }

    setLoading(false);
  }, []);
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW="620px">
        <Header />
        <Suspense
          fallback={
            <Flex justify={"center"}>
              <Spinner size="xl"></Spinner>
            </Flex>
          }
        >
          {loading && (
            <Flex justify={"center"}>
              <Spinner size="xl"></Spinner>
            </Flex>
          )}
          {!loading && (
            <Routes>
              <Route
                path={"/home"}
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
                element={!isUser ? <AuthPage /> : <Navigate to="/home" />}
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
              <Route
                path="/user/updateinfo"
                element={
                  isUser || localStorage.getItem("authToken") ? (
                    <UpdateInfo />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
          )}
        </Suspense>
        <Toaster
          theme={colorMode == "dark" ? "dark" : "light"}
          toastOptions={{
            style: { background: colorMode == "dark" ? "#71797E" : "white" },
          }}
        />
      </Container>
    </Box>
  );
});
export default App;
