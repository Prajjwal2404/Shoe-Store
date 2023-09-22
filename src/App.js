import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Nav from './Navigation/Nav'
import Home from './Pages/HomePage';
import Men from './Pages/MenPage'
import Women from './Pages/WomenPage'
import Kids from './Pages/KidsPage'
import Search from './Pages/SearchPage';
import Details from './Details/Details';
import WishList from './Pages/WishList'
import CartNav from './CartPage/CartNav/CartNav';
import CartEl from './CartPage/Cart/Cart';
import AddressEl from './CartPage/Address/Address'
import PaymentEl from './CartPage/Payment/Payment'
import Account from './Account/Account';
import LoginPage from './Pages/LoginPage';
import NotFound from './Pages/NotFoundPage';
import Error from './Pages/ErrorPage';
import { action as loginAction } from './Login/Login';
import { action as addressAction } from './CartPage/Address/Address';
import { loader as HomeLoader } from './Pages/HomePage';
import { loader as DetailLoader } from './Details/Details';
import { loader as SearchLoader } from './Pages/SearchPage';
import { loader as WishlistLoader } from './Pages/WishList';
import { loader as CartLoader } from './CartPage/CartNav/CartNav';
import { loader as AccountLoader } from './Account/Account';
import { loader as LoginLoader } from './Pages/LoginPage';

export default function App() {

    const router = createBrowserRouter(createRoutesFromElements(
        <Route path='/' element={<Nav />} action={loginAction} errorElement={<Error />}>
            <Route index element={<Home />} loader={HomeLoader} />
            <Route path='men' element={<Men />} />
            <Route path='women' element={<Women />} />
            <Route path='kids' element={<Kids />} />
            <Route path='search' element={<Search />} loader={SearchLoader} />
            <Route path='details/:id' element={<Details />} loader={DetailLoader} errorElement={<Error />} />
            <Route path='wishlist' element={<WishList />} loader={WishlistLoader} />
            <Route path='cart' element={<CartNav />} loader={CartLoader} >
                <Route index element={<CartEl />} />
                <Route path='address' element={<AddressEl />} action={addressAction} />
                <Route path='payment' element={<PaymentEl />} />
            </Route>
            <Route path='account' element={<Account />} loader={AccountLoader} />
            <Route path='login' element={<LoginPage />} action={loginAction} loader={LoginLoader} />
            <Route path='*' element={<NotFound />} />
        </Route>
    ))

    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}