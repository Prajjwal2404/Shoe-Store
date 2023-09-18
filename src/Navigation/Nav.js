import React, { useRef, useState } from 'react'
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../DB/FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth"
import Login from '../Login/Login';
import './Nav.css'

export default function Nav() {

    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleInputChange = event => {
        setQuery(event.target.value);
    }

    const handleClick = () => {
        if (query) {
            navigate(`/search?q=${query}`);
        }
    }

    const keyHandler = event => {
        if (event.key === 'Enter') {
            if (query) {
                navigate(`/search?q=${query}`);
            }
        }
    }


    const [signin, setSignin] = useState(false)
    React.useEffect(() => onAuthStateChanged(auth, user => {
        if (user !== null) {
            setSignin(true)
        }
        else {
            setSignin(false)
        }
    }), [])


    const wrapper = useRef();

    function loginPopup() {
        window.scrollTo(0, 0);
        wrapper.current.style.display = "flex";
        setTimeout(() => wrapper.current.style.transform = "scale(1)", 100);
    }


    let cartitems = '01';

    return (
        <>
            <nav>
                <div className='logo-div'>
                    <Link to={'/'}><GiRunningShoe className='logo-icon' /></Link>
                    <h2><big>S</big>hoe <big>S</big>tore</h2>
                </div>
                <div className='navigation'>
                    <NavLink to={'/'} className={({ isActive }) => isActive ? 'active' : ''}>HOME</NavLink>
                    <NavLink to={'men'} className={({ isActive }) => isActive ? 'active' : ''}>MEN</NavLink>
                    <NavLink to={'women'} className={({ isActive }) => isActive ? 'active' : ''}>WOMEN</NavLink>
                    <NavLink to={'kids'} className={({ isActive }) => isActive ? 'active' : ''}>KIDS</NavLink>
                </div>
                <div className='searchDiv'>
                    <input
                        id='searchbox'
                        type='text'
                        className='searchbox'
                        placeholder='Search for shoes'
                        onKeyDown={keyHandler}
                        onChange={handleInputChange}
                        value={query}
                    />
                    <FiSearch className='searchIcon' onClick={handleClick} />
                </div>
                <div className='others'>
                    <NavLink to={'wishlist'} className={({ isActive }) => isActive ? 'active' : ''}>
                        <AiOutlineHeart className='wishlist' />
                    </NavLink>
                    <NavLink to={'cart'} className={`cart ${({ isActive }) => isActive ? 'active' : ''}`} cartitems={cartitems}>
                        <BiCartAlt />
                    </NavLink>
                    {signin ? <NavLink to={'account'} className={({ isActive }) => isActive ? 'active' : ''}>
                        <AiOutlineUser /></NavLink> : <a onClick={loginPopup}><AiOutlineUser /></a>}
                </div>
            </nav>
            {!signin && <Login wrapper={wrapper} />}
            <Outlet />
        </>
    )
}
