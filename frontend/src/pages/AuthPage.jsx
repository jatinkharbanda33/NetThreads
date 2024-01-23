import React from 'react'
import { useSelector } from 'react-redux'
import LoginCard from '../components/LoginCard';
import SignUpCard from '../components/SignUpCard';
const AuthPage = () => {
  const auth=useSelector((state)=>state.auth);
  return (
    <>{auth==="login" ?<LoginCard /> :<SignUpCard />}</>
  )
}

export default AuthPage