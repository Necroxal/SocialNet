import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Logout = () => {
  const {setAuth, setCounters} = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    //clean localstorage
    localStorage.clear();
    //set states globals to clear
    setAuth({});
    setCounters({});
    //navigate to login
    navigate('/login');
  });
  return (
    <h1>Closing session ...</h1>
  )
}
