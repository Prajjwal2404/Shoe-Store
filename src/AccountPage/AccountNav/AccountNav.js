import React, { Suspense } from 'react'
import './AccountNav.css'
import { Await, NavLink, Outlet, defer, useLoaderData, useOutletContext } from 'react-router-dom'
import Loading from '../../Loading/Loading'
import RequireAuth, { CurrentUser } from '../../Functions/HandleUser'
import { user } from '../../DB/FirebaseConfig'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: CurrentUser().then(res => user(res.uid)) })
}

export default function AccountNav() {

    const dataSetPromise = useLoaderData()
    const outletContext = useOutletContext()
    outletContext.getCartItems()

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {(dataSetLoaded) => {
                    return (
                        <>
                            <nav className='acc-nav'>
                                <NavLink to={'/account'} end className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    USER INFO</NavLink>
                                <NavLink to={'addresses'} className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    SAVED ADDRESSES</NavLink>
                                <NavLink to={'orders'} className={({ isActive }) => isActive ? 'active-acc' : ''}>
                                    ORDER HISTORY</NavLink>
                            </nav>
                            <Outlet context={{ dataSetLoaded }} />
                        </>
                    )
                }}
            </Await>
        </Suspense>
    )
}
