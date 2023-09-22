import React, { Suspense, useEffect, useState } from 'react'
import { user, product, db } from '../DB/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Functions/HandleUser'
import { Await, defer, useLoaderData } from 'react-router-dom'
import Listings from '../Components/Listings'
import { arrayRemove, doc, updateDoc } from 'firebase/firestore/lite'
import Loading from '../Loading/Loading'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: CurrentUser().then(res => user(res.uid)).then(res => Promise.all(res.wishlist.map(async (id) => await product(id)))) })
}

export default function WishList() {

    const dataSetPromise = useLoaderData();
    const [wishlistSet, setWishlistSet] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const dataset = await dataSetPromise.dataSet;
            setWishlistSet(dataset)
        }
        fetchData()
    }, [])


    async function removeWishlist(productId, event) {
        event.preventDefault()
        setWishlistSet(prevWishlistSet => prevWishlistSet.filter((product) => product.id !== productId))
        const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
        await updateDoc(userDocRef, { wishlist: arrayRemove(productId) })
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {() => {
                    return wishlistSet.length > 0 ?
                        <Listings data={wishlistSet} isWishlist={true} removeWishlist={removeWishlist} /> :
                        <h2 style={{ marginTop: '7rem', textAlign: 'center' }}>Your wishlist is empty</h2>
                }}
            </Await>
        </Suspense>
    )
}
