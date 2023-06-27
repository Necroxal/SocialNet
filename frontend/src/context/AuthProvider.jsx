import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setloading] = useState(true);
    useEffect(()=>{
        authUser();
    },[]);

    const authUser = async()=>{
        //get date identify local storage
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        //check if i have the data (token and user)
        if(!token || !user){
            setloading(false);
            return false;
        }
        //Transform the data to object js
        const userObj = JSON.parse(user);
        const userId = userObj.id;
        //ajax request to check the token
        //get data profile user
        const request = await fetch(Global.url + 'user/profile/' + userId,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const data = await request.json();


        //Requets conts
        const requestCounter = await fetch(Global.url + 'user/counters/' + userId,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const dataCounters = await requestCounter.json();
        //Status auth
        setAuth(data.user);
        setCounters(dataCounters);
        setloading(false);
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                counters,
                setCounters,
                loading,

            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;