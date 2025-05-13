import React, { useRef } from 'react'
import { redirect } from 'react-router-dom';
import { getCurrentUserToken } from '../Functions/HandleAuth';
import Login from '../Login/Login'

export async function loader({ request }) {
    const required = getCurrentUserToken();
    if (required) {
        const redirectTo = new URL(request.url).searchParams.get('redirectTo')
        if (redirectTo) throw redirect(redirectTo)
        else throw redirect('/account')
    }
    return null
}

export default function LoginPage() {

    const wrapper = useRef([]);

    function loginPopup() {
        window.scrollTo(0, 0);
        wrapper.current[0].style.display = "flex";
        setTimeout(() => wrapper.current[0].style.transform = "scale(1)", 100);
    }

    const style = {
        marginTop: '7rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'
    }

    const button = {
        padding: '1rem 2rem', background: 'black', borderRadius: '15px', color: '#dadada', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '1rem'
    }

    return (
        <div style={style}>
            <h1 style={{ textAlign: 'center' }}>Please Login to continue.</h1>
            <button style={button} onClick={loginPopup}>Login</button>
            <Login wrapper={wrapper} />
        </div>
    )
}