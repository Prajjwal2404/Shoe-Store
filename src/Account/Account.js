import React from 'react'
import { auth, user } from '../DB/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Functions/HandleUser'
import { signOut } from "firebase/auth"
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'

export async function loader({ request }) {
    await RequireAuth(request)
    return await user((await CurrentUser()).uid)
}

export default function Account() {

    const navigate = useNavigate();
    const userObj = useLoaderData();
    const outletContext = useOutletContext();
    outletContext.getCartItems()

    const style = {
        marginTop: '7rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'
    }

    const button = {
        padding: '1rem 2rem', background: 'black', borderRadius: '15px', color: '#dadada', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '1rem'
    }

    async function logout() {
        await signOut(auth);
        navigate('/');
    }

    return (
        <div style={style}>
            <h1 style={{ textAlign: 'center' }}>Hi {userObj.username}</h1>
            <button style={button} onClick={logout}>Log Out</button>
        </div>
    )
}
