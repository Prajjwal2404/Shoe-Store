import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Nav from './Navigation/Nav'
import Home from './HomePage/Home';
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
import AccountNav from './AccountPage/AccountNav/AccountNav';
import UserInfo from './AccountPage/UserInfo/UserInfo';
import Addresses from './AccountPage/Addresses/Addresses';
import Orders from './AccountPage/Orders/Orders';
import LoginPage from './Pages/LoginPage';
import NotFound from './Pages/NotFoundPage';
import Error from './Pages/ErrorPage';
import { action as DetailsAction } from './Details/Details';
import { action as WishListAction } from './Pages/WishList';
import { action as CartAction } from './CartPage/Cart/Cart';
import { action as addressAction } from './CartPage/Address/Address';
import { action as addressesAction } from './AccountPage/Addresses/Addresses';
import { action as loginAction } from './Login/Login';
import { loader as HomeLoader } from './HomePage/Home';
import { loader as MenLoader } from './Pages/MenPage';
import { loader as WomenLoader } from './Pages/WomenPage';
import { loader as KidsLoader } from './Pages/KidsPage';
import { loader as DetailLoader } from './Details/Details';
import { loader as SearchLoader } from './Pages/SearchPage';
import { loader as WishlistLoader } from './Pages/WishList';
import { loader as CartLoader } from './CartPage/CartNav/CartNav';
import { loader as AccountLoader } from './AccountPage/AccountNav/AccountNav';
import { loader as LoginLoader } from './Pages/LoginPage';

export default function App() {

    const router = createBrowserRouter(createRoutesFromElements(
        <Route path='/' element={<Nav />} action={loginAction} errorElement={<Error />}>
            <Route index element={<Home />} loader={HomeLoader} errorElement={<Error />} />
            <Route path='men' element={<Men />} loader={MenLoader} errorElement={<Error />} />
            <Route path='women' element={<Women />} loader={WomenLoader} errorElement={<Error />} />
            <Route path='kids' element={<Kids />} loader={KidsLoader} errorElement={<Error />} />
            <Route path='search' element={<Search />} loader={SearchLoader} errorElement={<Error />} />
            <Route path='details/:id' element={<Details />} loader={DetailLoader} action={DetailsAction} errorElement={<Error />} />
            <Route path='wishlist' element={<WishList />} loader={WishlistLoader} action={WishListAction} errorElement={<Error />} />
            <Route path='cart' element={<CartNav />} loader={CartLoader} action={CartAction} errorElement={<Error />} >
                <Route index element={<CartEl />} />
                <Route path='address' element={<AddressEl />} action={addressAction} />
                <Route path='payment' element={<PaymentEl />} />
            </Route>
            <Route path='account' element={<AccountNav />} loader={AccountLoader} action={addressesAction} errorElement={<Error />} >
                <Route index element={<UserInfo />} />
                <Route path='addresses' element={<Addresses />} />
                <Route path='orders' element={<Orders />} />
            </Route>
            <Route path='login' element={<LoginPage />} action={loginAction} loader={LoginLoader} />
            <Route path='*' element={<NotFound />} />
        </Route>
    ))

    return (
        <RouterProvider router={router} />
    )
}