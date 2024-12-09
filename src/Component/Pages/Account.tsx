import React from 'react';
import { AuthData } from '../Auth/AuthWrapper';

const Account = () => {
  const  { user } = AuthData();
  return (
    <div className='page'>
       <h2> Your Account </h2>
       <p> User Name : {user?.name} </p>
    </div>
  );
}

export default Account;
