import React, {useState} from 'react';
import './Register.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc} from "firebase/firestore";
import { auth, firestore} from './firebase';
import { useNavigate, Link } from "react-router-dom";
import logo from './Logo.png'

function Register() {
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [idNum, setIdNum] = useState("");
    const [mobile, setMobile] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [userRole, setUserRole] = useState("");

    function handleResetRole() {
        setUserRole("");
    }

    function handleUserRole(role) {
        setUserRole(role);
    }

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "firstName"){
            setFirstName(value);
        }
        if(id === "lastName"){
            setLastName(value);
        }
        if(id === "email"){
            setEmail(value);
        }
        if(id === "idNum"){
            setIdNum(value);
        }
        if(id === "mobile"){
            setMobile(value);
        }
        if(id === "password"){
            setPassword(value);
        }
        if(id === "confirmPassword"){
            setConfirmPassword(value);
        }

    }

    const signUp = async (email, password, firstName, lastName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;
            if (userRole === "admin") {
                await setDoc(doc(firestore, "users", user.uid), {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    mobile: mobile,
                    idNum: idNum,
                    role: userRole,
                    createdEvents: [],
                });
            } else {
                await setDoc(doc(firestore, "users", user.uid), {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                    mobile: mobile,
                    idNum: idNum,
                    role: userRole,
                });
            }
            return true
        } catch (error) {
            return {error: error.message}
        }
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword) {
            console.error("Passwords do not match")
        } else {
            setEmail("")
            setPassword("")
            const res = await signUp(email, password, firstName, lastName);
            if (res.error) {
                console.error(res.error)
            } else {
                // Route back to calendar here
                navigate('/calendar');
            }
        }
    };

    return(
        <div>
            <div className="logo">
             <img src={logo} alt="My logo" />
            </div>
            {
                userRole === "" ? (
                    <div className='registration-box'>
                        <div className='registration-role-body'>
                            <button className='btnRegAdmin' value="admin" onClick={(e) => handleUserRole(e.target.value)}>REGISTER AS ADMIN</button> <br></br>
                            <button className='btnRegStd' value="student" onClick={(e) => handleUserRole(e.target.value)}>REGISTER AS STUDENT</button>
                        </div>
                        <div>
                            <Link to="/" className='backLink'>
                            Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="registration-container">
                        <h2>CREATE ACCOUNT</h2>
                        <div className="registration-body">
                            <div className="username">
                                <label className="registration__label" for="firstName">First Name </label>
                                <input className="registration__input" type="text" value={firstName} onChange = {(e) => handleInputChange(e)} id="firstName" placeholder="First Name"/>
                            </div>
                            <div className="lastname">
                                <label className="registration__label" for="lastName">Last Name </label>
                                <input  type="text" name="" id="lastName" value={lastName}  className="registration__input" onChange = {(e) => handleInputChange(e)} placeholder="LastName"/>
                            </div>
                            <div className="email">
                                <label className="registration__label" for="email">Email </label>
                                <input  type="email" id="email" className="registration__input" value={email} onChange = {(e) => handleInputChange(e)} placeholder="Email"/>
                            </div>
                            <div className="idNum">
                                <label className="registration__label" for="idNum">ID Number </label>
                                <input  type="text" id="idNum" className="registration__input" value={idNum} onChange = {(e) => handleInputChange(e)} placeholder="ID Number"/>
                            </div>
                            <div className="mobile">
                                <label className="registration__label" for="mobile">Mobile Number </label>
                                <input  type="text" id="mobile" className="registration__input" value={mobile} onChange = {(e) => handleInputChange(e)} placeholder="0123456789"/>
                            </div>
                            <div className="password">
                                <label className="registration__label" for="password">Password </label>
                                <input className="registration__input" type="password"  id="password" value={password} onChange = {(e) => handleInputChange(e)} placeholder="Password"/>
                            </div>
                            <div className="confirm-password">
                                <label className="registration__label" for="confirmPassword">Confirm Password </label>
                                <input className="registration__input" type="password" id="confirmPassword" value={confirmPassword} onChange = {(e) => handleInputChange(e)} placeholder="Confirm Password"/>
                            </div>
                        </div>
                        <div class="footer">
                            <button className='btnReg' onClick={(e)=>handleSubmit(e)} type="submit">REGISTER</button>
                            <button className='btnBack'onClick={handleResetRole}>Back</button>
                        </div>
                    </div>
                )
            }
        </div>  
    )       
}

export default Register;