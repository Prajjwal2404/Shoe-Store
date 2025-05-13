import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BiCartAlt } from "react-icons/bi";
import { GiRunningShoe } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { IoMenu, IoClose } from "react-icons/io5"
import { IoIosArrowForward } from 'react-icons/io'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUserToken } from '../Functions/HandleAuth';
import Login from '../Login/Login';
import HandleMedia from '../Functions/HandleMedia'
import './Nav.css'

export default function Nav() {

    const [query, setQuery] = useState('');
    const [cartItems, setCartItems] = useState('');
    const [signin, setSignin] = useState(!!getCurrentUserToken());
    const navigate = useNavigate();

    useEffect(() => {
        customStorageEvent()
        function handleStorageChange(event) {
            if (event.key === 'token') {
                if (event.newValue) {
                    setSignin(true);
                } else {
                    setSignin(false);
                }
            }
        };
        window.addEventListener('storage-changed', handleStorageChange);
        return () => window.removeEventListener('storage-changed', handleStorageChange);
    }, []);

    useEffect(() => {
        if (signin) getCartItems();
        else setCartItems('');
    }, [signin])

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


    async function getCartItems() {
        const token = getCurrentUserToken();
        if (token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/me/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        sessionStorage.removeItem('token');
                        localStorage.removeItem('token');
                        setCartItems('');
                    }
                    throw new Error('Failed to fetch cart items');
                }
                const cartData = await response.json();
                const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
                const totalItemsStr = (totalItems <= 9 && totalItems > 0) ? `0${totalItems}` :
                    (totalItems > 9) ? `${totalItems}` : '';
                setCartItems(totalItemsStr);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setCartItems('');
            }
        } else {
            setCartItems('');
        }
    }


    const isTablet = HandleMedia('screen and (max-width: 1100px)')
    const isMobile = HandleMedia('screen and (max-width: 800px) and (orientation: portrait)')
    const [switcher, setSwitcher] = useState(false);
    const wrapper = useRef([]);

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

    function loginPopup() {
        window.scrollTo(0, 0);
        wrapper.current[0].style.display = "flex";
        setTimeout(() => wrapper.current[0].style.transform = "scale(1)", 100);
        if (isMobile) menuSwitch();
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
                        <NavLink to={'cart'} className={`cart-mob ${({ isActive }) => isActive ? 'active' : ''}`}
                            onClick={menuSwitch}><span>{cartItems ? `(${cartItems})` : ''}</span><span>CART</span></NavLink>
                        {signin ? <NavLink to={'account'} className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={menuSwitch}>ACCOUNT</NavLink> : <a onClick={loginPopup}>LOGIN</a>}
                    </>}
                </div>
                {isMobile && <div className='navigation-back' />}
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

function customStorageEvent() {
    const localSetItem = localStorage.setItem;
    const localRemoveItem = localStorage.removeItem;

    localStorage.setItem = function (key, value) {
        const event = new Event('storage-changed');
        event.key = key;
        event.newValue = value;
        localSetItem.apply(this, arguments);
        window.dispatchEvent(event);
    };

    localStorage.removeItem = function (key) {
        const event = new Event('storage-changed');
        event.key = key;
        event.newValue = null;
        localRemoveItem.apply(this, arguments);
        window.dispatchEvent(event);
    };

    const sessionSetItem = sessionStorage.setItem;
    const sessionRemoveItem = sessionStorage.removeItem;

    sessionStorage.setItem = function (key, value) {
        const event = new Event('storage-changed');
        event.key = key;
        event.newValue = value;
        sessionSetItem.apply(this, arguments);
        window.dispatchEvent(event);
    };

    sessionStorage.removeItem = function (key) {
        const event = new Event('storage-changed');
        event.key = key;
        event.newValue = null;
        sessionRemoveItem.apply(this, arguments);
        window.dispatchEvent(event);
    };
}