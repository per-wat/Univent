import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Popup from "./components/Popup";
import './Profile.css';
import { firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import {EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { useAuthValue } from "./AuthProvider";

function useProfile() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [popupVisible, setPopupVisible] = useState(false); // state for the popup visibility
    const [popupType, setPopupType] = useState(''); // state for the popup type
    const [popupMessage, setPopupMessage] = useState(''); // state for the popup message
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const {currentUser} = useAuthValue();
    const navigate = useNavigate();
    const auth = getAuth();
    

    //Function to handle the password change
    async function handlePasswordChange() {

        const user = auth.currentUser;

        const creds = EmailAuthProvider.credential(user.email, oldPassword);

        reauthenticateWithCredential(user, creds).then(() => {
            // Re-authentication was successful, so update the password
            updatePassword(user, newPassword);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPopupType("success");
            setPopupMessage("Password successfully changed!");
            setPopupVisible(true);
        }).catch((error) => {
            setPopupType("error");
            setPopupMessage(error.message);
            setPopupVisible(true);
        });
    }
     
    const handleSubmit = async e => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPopupType("error");
            setPopupMessage("All passwords need to be filled!");
            setPopupVisible(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPopupType("error");
            setPopupMessage("Passwords is not the same");
            setPopupVisible(true);
            return;
        }
      
        await handlePasswordChange();
    };  

    const handleData = async () => {
        const data = await getDoc(doc(firestore, "users", currentUser.uid));
        setUserData(data.data())
    };

    useEffect(() => {
        if (currentUser) {
            handleData().then(() => {
                setLoading(false);
            });
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* render the Popup component if it's visible */}
            {popupVisible && (
                <Popup
                    message={popupMessage}
                    type={popupType}
                    onClose={() => setPopupVisible(false)}
                />
            )}
            <Navbar/>
            <div className="container-profile">
                <div className="profile_title">
                    <h2>My Profile</h2>
                </div>
                <div className="profile-body">
                    <div className="profile-card">
                        <div className="header">
                        <h3>DETAILS</h3> 
                        </div>
                        <div className="profile-card-body">
                           <div>Full Name : {userData.firstName} {userData.lastName}</div>
                           <div>ID : {userData.idNum}</div>
                        </div>
                    </div>
                    <div className="profile-card">
                        <div className="header">
                        <h3>CONTACT</h3>
                        </div>
                        <div className="profile-card-body">
                            <div>Mobile : {userData.mobile}</div> 
                            <div>Email : {userData.email}</div>
                        </div>
                    </div>
                    <div className="profile-card">
                        <div className="header">
                            <h3>CHANGE PASSWORD</h3>
                        </div>
                        <div className="profile-card-body">
                            <div className="old-password">
                                <label className="" for="oldPassword">Old Password : </label>
                                <input className="" type="password"  id="oldPassword" placeholder="Old Password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                            </div>
                            <div className="new-password">
                                <label className="" for="newPassword">New Password : </label>
                                <input className="" type="password"  id="newPassword" placeholder="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                            </div>
                            <div className="confirm-password">
                                <label className="" for="confirmPassword">Confirm Password : </label>
                                <input className="" type="password"  id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="password-footer">
                            <button onClick={handleSubmit} type="submit">Save Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

function Profile() {
    const profilePage = useProfile();

    if(!profilePage) {
        return <div>Loading...</div>
    }

    return profilePage;
}

export default Profile