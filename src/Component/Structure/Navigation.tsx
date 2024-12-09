import React from 'react';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Private from '../Pages/Private';
import Account from '../Pages/Account';
import SignIn from '../Pages/SignUp';
import { INavigationPart } from '../Interfaces/Basic/INavigationPart';

// Here we will define the array of routes

export const NavWeb : INavigationPart[] = [
    {path: "/", name:"Home",element:<Home/>,isMenu:true,isPrivate:false},
   
    // {path: "/*", name:"Home",element:<Home/>,isMenu:false,isPrivate:false}, 
    // {path: "/about", name:"About",element:<About/>,isMenu:true,isPrivate:false},
    // {path: "/login", name:"Login",element:<Login/>,isMenu:false,isPrivate:false},
    {path: "/private", name:"Private",element:<Private/>,isMenu:true,isPrivate:true},
    {path: "/account", name:"Account",element:<Account/>,isMenu:true,isPrivate:true},
    // {path: "/login", name:"Log in",element:<Login/>,isMenu:false,isPrivate:false},
     // For deep roots - use *
    {path: "/login/*", name:"Log in",element:<Login/>,isMenu:false,isPrivate:false},
    {path: "/signIn", name:"Sign In",element:<SignIn/>,isMenu:false,isPrivate:false}
]

export const NavMain : INavigationPart[] = [
    {path: "/Edit/:id", name:"Edit",element:<Private/>,isMenu:true,isPrivate:false},
]

