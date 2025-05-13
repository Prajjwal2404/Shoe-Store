import React, { Suspense, useEffect, useState } from 'react'
import './CartNav.css'
import { NavLink, Outlet, useOutletContext, defer, useLoaderData, Await, useSearchParams, Link } from 'react-router-dom'
import { RequireAuth } from '../../Functions/HandleAuth'
import { fetchUserAddresses, fetchUserCart } from '../../Functions/HandleBackend'
import Loading from '../../Loading/Loading'
import { IoIosCheckmarkCircle } from 'react-icons/io'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: [fetchUserCart(), fetchUserAddresses()] })
}

export default function CartNav() {

    const [searchParams] = useSearchParams();
    const order = searchParams.get('order');
    const dataSetPromise = useLoaderData();
    const { getCartItems } = useOutletContext()

    useEffect(() => {
        if (order === 'success') getCartItems()
    }, [order])

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={Promise.all(dataSetPromise.dataSet)}>
                {(dataSetLoaded) => {
                    const [cart, addresses] = dataSetLoaded
                    if (cart.length === 0) getCartItems()

                    return (order === 'success') ?
                        <div className='order-placed'>
                            <IoIosCheckmarkCircle className='check-icon' />
                            <h2>Order Placed Successfully</h2>
                            <Link to={'/'}>Done</Link>
                        </div> : (cart.length > 0) ?
                            <>
                                <nav className='cart-nav'>
                                    <NavLink to={'/cart'} end className={({ isActive }) => isActive ? 'active-nav' : ''}>CART</NavLink>
                                    <hr />
                                    <NavLink to={'address'} className={({ isActive }) => isActive ? 'active-nav' : ''}>ADDRESS</NavLink>
                                    <hr />
                                    <NavLink to={'payment'} className={({ isActive }) => isActive ? 'active-nav' : ''}>PAYMENT</NavLink>
                                </nav>
                                <Outlet context={{ getCartItems, cart, addresses }} />
                            </> : <h2 style={{ marginTop: '7rem', textAlign: 'center' }}>Your cart is empty</h2>
                }}
            </Await>
        </Suspense>
    )
}
