import React, { useState } from 'react';
import "../App.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState<string>(''); 
    const [password, setPassword] = useState<string>(''); 
    const navigate = useNavigate()
    const handleLogin = (e: React.FormEvent) => { 
        e.preventDefault();  
        axios.post(`${import.meta.env.VITE_REACT_API_URL}AdminLogin`,{username:username,password:password})
        .then(res=>{
            if(res.data.status === true){
                navigate('/AdminDashboard')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    };
    return ( 
        <>
            <div className="login-container"> 
                <form className="login-form" onSubmit={handleLogin}> 
                    <h1 style={{textAlign:'center'}}>Admin Login</h1> 
                    <div className="form-group"> 
                        <label htmlFor="username">Username</label> 
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /> 
                    </div> 
                    <div className="form-group"> 
                        <label htmlFor="password">Password</label> 
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /> 
                    </div> 
                    <button type="submit">Login</button> 
                </form> 
            </div>
        </>
     );
}

export default AdminLogin;