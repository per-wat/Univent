import React, { useEffect, useState } from 'react';
import logo from './Logo.png'
import './Navbar.css'
import {
  Nav,
  NavLink,
  NavMenu
} from './NavbarElements';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from './AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const NavbarAdmin = () => {

  const {currentUser} = useAuthValue();
  const [userRole, setUserRole] = useState('');

  const getUserRole = async () => {
    const data = await getDoc(doc(firestore, "users", currentUser.uid));
    setUserRole(data.data().role);
  }
 
  const navigate = useNavigate();
  const handleLogout = async () => {
    const auth = getAuth();
    signOut(auth).then(()=>{
      navigate("/")
    }).catch((error)=> {
        return{error: error.message}
    })
    
  }

  useEffect(() => {
    getUserRole();
  }, [currentUser])
  return (
    <>
      <Nav>
       
          <img src={logo} alt="Logo" />
        <NavMenu>
            
          <NavLink to='/calendar' activeStyle>
            Home
          </NavLink>

          {
            userRole === "admin" ? (
              <div>
                <NavLink to='/events' activeStyle>
                  Event
                </NavLink>

                <NavLink to='/events/report' activeStyle>
                  Report
                </NavLink>
              </div>
            ) : userRole === "student" ? (
              <div>
                <NavLink to='/booking' activeStyle>
                  Event
                </NavLink>

                <NavLink to='/mybooking' activeStyle>
                  My Booking
                </NavLink>

                <NavLink to='/history' activeStyle>
                  History
                </NavLink>
              </div>
            ) : (
              <div></div>
            )
          }

          <NavLink to='/profile' activeStyle>
            Profile
          </NavLink>

          <NavLink to='/' onChange={handleLogout} activeStyle>
            Sign Out
          </NavLink>

        </NavMenu>
        
      </Nav>
    </>
  );
};

export default NavbarAdmin;