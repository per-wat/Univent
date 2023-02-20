import React, { useState } from "react";
import {Link} from 'react-router-dom';
import logo from './Logo.png'
import './Login.css'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth} from './firebase';
import { useNavigate } from "react-router-dom";

function LoginAdmin() {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmail("");
        setPassword("");
        const res = await signIn(email, password);
        if (res.error) {
            console.error(res.error)
        } else {
            // Route back to calendar here
            navigate('/calendar');
        }
    }

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            return true
        } catch (error) {
            return{error: error.message}
        }
    };  
        return (
    
        <div>
            <div className="logo">
             <img src={logo} alt="My logo" />
            </div>

             <form onSubmit={handleSubmit}>

                <div className="content">
                    <h2>SIGN IN</h2>

                    <input type="email" className="input" placeholder="Email address" value={email} 
                    onChange={(e) => setEmail(e.target.value)} />
                    <br></br>
                    <br></br>
                    <input type="password" className="input" placeholder="Password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} />
                
                    
                    <button type="submit" className="button">LOGIN</button>
                    
                   
                    <div className="account">
                        Don't have an account?
                        <Link to="/register">
                            Sign up
                        </Link>
                    </div>
                </div>
             </form>
            </div>

        );
        
    }

export default LoginAdmin;