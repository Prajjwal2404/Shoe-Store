import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { IoMenu, IoClose } from "react-icons/io5"
import { IoIosArrowForward } from 'react-icons/io'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth, user } from '../DB/FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth"
import Login from '../Login/Login';
import { CurrentUser } from '../Functions/HandleUser';
import HandleMedia from '../Functions/HandleMedia'
import './Nav.css'

export default function Nav() {

    const [query, setQuery] = useState('');
    const [cartItems, setCartItems] = useState('');
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


    const wrapper = useRef([]);

    function loginPopup() {
        window.scrollTo(0, 0);
        wrapper.current[0].style.display = "flex";
        setTimeout(() => wrapper.current[0].style.transform = "scale(1)", 100);
    }


    async function getCartItems() {
        const currentuser = await CurrentUser()
        if (currentuser) {
            const userObj = await user(currentuser.uid)
            var totalItems = 0
            userObj.cart.forEach(item => totalItems += item.quantity)
            const totalItemsStr = (totalItems <= 9 && totalItems > 0) ? `0${totalItems}` :
                (totalItems > 9) ? `${totalItems}` : ''
            setCartItems(totalItemsStr)
        }
        else setCartItems('')
    }


    const isTablet = HandleMedia('screen and (max-width: 1100px)')
    const isMobile = HandleMedia('screen and (max-width: 800px) and (orientation: portrait)')
    const [switcher, setSwitcher] = useState(false);

    useEffect(() => {
        function checkMenu(event) {
            if (!wrapper.current[1].contains(event.target) && !wrapper.current[2].contains(event.target) && switcher) {
                menuSwitch()
            }
        }
        if (isMobile || isTablet) window.addEventListener('click', checkMenu)
        return () => window.removeEventListener('click', checkMenu)
    }, [isMobile, isTablet, switcher])

    useEffect(() => {
        if (isMobile) hideSearch()
    }, [isMobile])

    function menuSwitch() {
        setSwitcher(!switcher)
        wrapper.current[1].classList.toggle('open')
    }

    function loginPopupM() {
        menuSwitch()
        loginPopup()
    }

    function showSearch() {
        wrapper.current[6].classList.add('hide')
        wrapper.current[3].classList.add('hide')
        wrapper.current[4].classList.add('show')
        wrapper.current[5].focus()
    }

    function hideSearch() {
        wrapper.current[4].classList.remove('show')
        wrapper.current[5].blur()
        setTimeout(() => {
            wrapper.current[6].classList.remove('hide')
            wrapper.current[3].classList.remove('hide')
        }, 500)
    }

    function focusChange() {
        if (isMobile) {
            hideSearch()
        }
    }


    return (
        <>
            <nav className='main-nav'>
                <div className='logo-div' ref={el => wrapper.current[3] = el}>
                    <Link to={'/'}><GiRunningShoe className='logo-icon' /></Link>
                    <h2><big>S</big>hoe <big>S</big>tore</h2>
                </div>
                <div className='navigation' ref={el => wrapper.current[1] = el}>
                    <NavLink to={'/'} className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={menuSwitch}>HOME</NavLink>
                    <NavLink to={'men'} className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={menuSwitch}>MEN</NavLink>
                    <NavLink to={'women'} className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={menuSwitch}>WOMEN</NavLink>
                    <NavLink to={'kids'} className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={menuSwitch}>KIDS</NavLink>
                    {isMobile && <>
                        <NavLink to={'wishlist'} className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={menuSwitch}>WISHLIST</NavLink>
                        <NavLink to={'cart'} className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={menuSwitch}>CART</NavLink>
                        {signin ? <NavLink to={'account'} className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={menuSwitch}>ACCOUNT</NavLink> : <a onClick={loginPopupM}>LOGIN</a>}
                    </>}
                </div>
                <div className='searchDiv' ref={el => wrapper.current[4] = el}>
                    {isMobile && <IoIosArrowForward className='close-search' />}
                    <input
                        id='searchbox'
                        type='text'
                        className='searchbox'
                        placeholder='Search for shoes'
                        onKeyDown={keyHandler}
                        onChange={handleInputChange}
                        value={query}
                        onBlur={focusChange}
                        ref={el => wrapper.current[5] = el}
                    />
                    <FiSearch className='searchIcon' onClick={handleClick} />
                </div>
                {isMobile && <span className='searchIconM' ref={el => wrapper.current[6] = el} onClick={showSearch}>
                    <FiSearch /></span>}
                {!isMobile ?
                    <div className='others'>
                        <NavLink to={'wishlist'} className={({ isActive }) => isActive ? 'active' : ''}>
                            <AiOutlineHeart className='wishlist' />
                        </NavLink>
                        <NavLink to={'cart'} className={`cart ${({ isActive }) => isActive ? 'active' : ''}`} cartitems={cartItems}>
                            <BiCartAlt />
                        </NavLink>
                        {signin ? <NavLink to={'account'} className={({ isActive }) => isActive ? 'active' : ''}>
                            <AiOutlineUser /></NavLink> : <a onClick={loginPopup}><AiOutlineUser /></a>}
                    </div> : <span className='menu-span' ref={el => wrapper.current[2] = el} onClick={menuSwitch}>
                        {switcher ? <IoClose className='menu-icon' /> : <IoMenu className='menu-icon' />}</span>}
                {isTablet && !isMobile &&
                    <span className='menu-span' ref={el => wrapper.current[2] = el} onClick={menuSwitch}>
                        {switcher ? <IoClose className='menu-icon' /> : <IoMenu className='menu-icon' />}</span>}
            </nav>
            {!signin && <Login wrapper={wrapper} />}
            <Outlet context={{ getCartItems }} />
        </>
    )
}
