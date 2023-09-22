import React, { Suspense, useState } from 'react'
import './CartNav.css'
import { NavLink, Outlet, useOutletContext, defer, useLoaderData, Await, useSearchParams, Link } from 'react-router-dom'
import RequireAuth, { CurrentUser } from '../../Functions/HandleUser'
import { user } from '../../DB/FirebaseConfig'
import Loading from '../../Loading/Loading'
import { IoIosCheckmarkCircle } from 'react-icons/io'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: CurrentUser().then(res => user(res.uid)) })
}

export default function CartNav() {

    const [searchParams] = useSearchParams();
    const order = searchParams.get('order');
    const dataSetPromise = useLoaderData();
    const { getCartItems } = useOutletContext()
    const [empty, setEmpty] = useState(false)

    if (empty) return <h2 style={{ marginTop: '7rem', textAlign: 'center' }}>Your cart is empty</h2>

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {(dataSetLoaded) => {
                    return (dataSetLoaded.cart.length > 0) ?
                        <>
                            <nav className='cart-nav'>
                                <NavLink to={'/cart'} end className={({ isActive }) => isActive ? 'active-nav' : ''}>CART</NavLink>
                                <hr />
                                <NavLink to={'address'} className={({ isActive }) => isActive ? 'active-nav' : ''}>ADDRESS</NavLink>
                                <hr />
                                <NavLink to={'payment'} className={({ isActive }) => isActive ? 'active-nav' : ''}>PAYMENT</NavLink>
                            </nav>
                            <Outlet context={{ getCartItems, dataSetLoaded, setEmpty }} />
                        </> : (order === 'success') ?
                            <div className='order-placed'>
                                <IoIosCheckmarkCircle className='check-icon' />
                                <h2>Order Placed Successfully</h2>
                                <Link to={'/'}>Done</Link>
                            </div> : <h2 style={{ marginTop: '7rem', textAlign: 'center' }}>Your cart is empty</h2>
                }}
            </Await>
        </Suspense>
    )
}
