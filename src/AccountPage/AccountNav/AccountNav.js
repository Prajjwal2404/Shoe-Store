import React, { Suspense } from 'react'
import { Await, NavLink, Outlet, defer, useLoaderData } from 'react-router-dom'
import { RequireAuth } from '../../Functions/HandleAuth'
import { fetchUserDetails, fetchUserAddresses, fetchUserOrders } from '../../Functions/HandleBackend'
import Loading from '../../Loading/Loading'
import './AccountNav.css'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: [fetchUserDetails(), fetchUserAddresses(), fetchUserOrders()] })
}

export default function AccountNav() {

    const dataSetPromise = useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={Promise.all(dataSetPromise.dataSet)}>
                {(dataSetLoaded) => {
                    const [userDetails, userAddresses, userOrders] = dataSetLoaded
                    return (
                        <>
                            <nav className='acc-nav'>
                                <NavLink to={'/account'} end className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    User Info</NavLink>
                                <NavLink to={'addresses'} className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    Saved Addresses</NavLink>
                                <NavLink to={'orders'} className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    Order History</NavLink>
                            </nav>
                            <Outlet context={{ userDetails, userAddresses, userOrders }} />
                        </>
                    )
                }}
            </Await>
        </Suspense>
    )
}
