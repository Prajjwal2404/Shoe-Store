import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import './UserInfo.css'

export default function UserInfo() {

    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const userObj = outletContext.userDetails

    function logout() {
        sessionStorage.removeItem('token')
        localStorage.removeItem('token')
        navigate('/', { replace: true });
    }

    return (
        <div className='user-info-container'>
            <div className='user-info-div'><h2>Username: </h2><p>{userObj.username}</p></div>
            <div className='user-info-div'><h2>Email: </h2><p>{userObj.email}</p></div>
            <button onClick={logout}>Log Out</button>
        </div>
    )
}
