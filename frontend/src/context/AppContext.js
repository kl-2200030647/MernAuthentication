/*
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext=createContext()
export const AppContextProvider=(props)=>{
    const backendUrl=process.env.REACT_APP_BACKEND_URL
    const [isLoggedin, setIsLoggedin] =useState(null)
    const [userData, setUserData] =useState(null)

    const getUserData=async()=>{
        try{
            const {data}=await axios.get(backendUrl + '/api/user/data')
            data.success? setUserData(data.userData):toast.error(data.message)
        }
        catch(error){
    toast.error(error?.response?.data?.message || "Failed to fetch user data");
}

    }

    const value={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
    */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials=true;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Changed from false to null
    // call this function when ever the page gets loaded 
    const getAuthState=async()=>{
        axios.defaults.withCredentials=true;
        try{
            const {data}=await axios.get(backendUrl+'/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true);
                getUserData()
            }

        }catch(error){
            toast.error(error.message)
        }
    }


    // Configure axios defaults once when context is created
    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            console.log("Fetching user data..."); // Debug log
            {/*Here we are just sending the api path not the cookies 
                This results when we refresh user gets loggedout  */}
            const { data } = await axios.get(backendUrl + '/api/user/data');
            
            if (data.success) {
                console.log("User data received:", data.userData); // Debug log
                setUserData(data.userData);
                setIsLoggedin(true);
                return true; // Return success status
            } else {
                toast.error(data.message);
                return false;
            }
        }
        catch (error) {
            console.error("User data fetch error:", error); // More detailed error
            toast.error(error?.response?.data?.message || "Failed to fetch user data");
            return false;
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])
    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}