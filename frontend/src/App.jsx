import { Container ,Box} from "@chakra-ui/react";
import Header from "./components/Header";
import {Navigate,Route,Routes} from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
function App() {
  const user=useSelector((state)=>state.user);
  return (
    <Box position={"relative"} w={'full'}>
      <Container maxW='620px'>
        <Header />
        <Routes>
          <Route path='/' element={user ? <HomePage /> :<Navigate to="/auth" />} />
          <Route path='/auth' element={!user ? <AuthPage />: <Navigate to="/" />} />
        </Routes>
        </Container>
    </Box>
  );
}

export default App;
