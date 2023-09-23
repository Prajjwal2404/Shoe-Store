import React from 'react'
import './UserInfo.css'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../DB/FirebaseConfig';

export default function UserInfo() {

    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const userObj = outletContext.dataSetLoaded

    async function logout() {
        await signOut(auth);
        navigate('/');
    }

    return (
        <div className='user-info-container'>
            <div className='user-info-div'><h2>Username: </h2><p>{userObj.username}</p></div>
            <div className='user-info-div'><h2>Email: </h2><p>{userObj.email}</p></div>
            <button onClick={logout}>Log Out</button>
        </div>
    )
}
