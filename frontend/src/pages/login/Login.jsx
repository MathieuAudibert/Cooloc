import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login/style.css';


const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;
