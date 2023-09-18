import React, { Suspense, useEffect, useState } from 'react'
import { user, product, db } from '../DB/FirebaseConfig'
import RequireAuth, { CurrentUser } from '../Functions/HandleUser'
import { Await, defer, useLoaderData } from 'react-router-dom'
import Listings from '../Components/Listings'
import { arrayRemove, doc, updateDoc } from 'firebase/firestore/lite'

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: CurrentUser().then(res => user(res.uid)).then(res => Promise.all(res.wishlist.map(async (id) => await product(id)))) })
}

export default function WishList() {

    const dataSetPromise = useLoaderData();
    const [wishlistSet, setWishlistSet] = useState([]);
    const [initialData, setInitialData] = useState([]);

    useEffect(() => setWishlistSet(initialData), [initialData])


    async function removeWishlist(productId, event) {
        event.preventDefault()
        setWishlistSet(prevWishlistSet => prevWishlistSet.filter((product) => product.id !== productId))
        const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
        await updateDoc(userDocRef, { wishlist: arrayRemove(productId) })
    }

    return (
        <>
            <Suspense fallback={<h2 style={{ textAlign: 'center', marginTop: '7rem' }}>Loading...</h2>}>
                <Await resolve={dataSetPromise.dataSet}>
                    {dataSetLoaded => {
                        setInitialData(dataSetLoaded)
                        return <Listings data={wishlistSet} isWishlist={true} removeWishlist={removeWishlist} />
                    }}
                </Await>
            </Suspense>
        </>
    )
}
