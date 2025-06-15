import express from 'express';
import { isAuthenticated, login, logout, register, sendVerifyOtp, verifyEmail, resetPassword, sendResetOtp} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

//const express = require('express');
const authRoutes=express.Router();



// in post 2 params are given , first one is in which url , and 2nd is the function to make the route work 
authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',logout); // here only route is handled without middleware
authRoutes.post('/send-verify-otp',userAuth,sendVerifyOtp);
// here only route is handled with middleware, so it has to be mentioned after the route 
authRoutes.post('/verify-email',userAuth,verifyEmail);
authRoutes.get('/is-auth',userAuth,isAuthenticated);
authRoutes.post('/send-reset-otp',sendResetOtp);
authRoutes.post('/reset-password',resetPassword);







// the url should be as localhost:2025/api/auth/register
// We have written the routes here and to maket them work we have to use them in Server.js 
export default authRoutes;