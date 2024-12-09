import React, { createContext, useContext, useState } from 'react';
import { RenderWebMenu, RenderWebRoutes } from '../Structure/RenderNavigation';
import { IAuthContextType } from '../Interfaces/Basic/IAuthContextType';


// #region Settings for createContext

    // Creating Default values

    const AuthContext = createContext<IAuthContextType>({
        user: null,
        login : ()=>{},
        logout : () => {}
        // isAuthenticated: false;
    });


    // Passing Data Deeply with Context

    export const AuthData = () => useContext(AuthContext);

// #endregion

// #region Provider

export const AuthWrapper = () => {

    
   // Hook for user details
   const [user , setUser ] = useState<{name:string,isAuthenticated:boolean }>({name:"",isAuthenticated:false}) 

   // Connecting the user and verifying accordingly
   const login = (userName : string, password : string) : Promise<string> => 
   {

       // Make a call to the authentication API to check the username

       return new Promise ( (resolve, reject) => {
        if(password === "password")
        {
            setUser({name:userName, isAuthenticated:true});
            resolve("Success");
        }
        else{
            reject("Incorrect password");
        }

       });

   }

   // Disconnecting the user
   const logout = () : void=>
    {
     setUser({...user,isAuthenticated:false});
    }

  return (
    <AuthContext.Provider value={{user, login, logout}}>

    <>
        <RenderWebMenu/>
        <RenderWebRoutes/>
    </>

    </AuthContext.Provider>
  );
}

// #endregion

export default AuthWrapper;
