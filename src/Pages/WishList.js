import React, { Suspense } from 'react'
import { fetchUserWishlist, removeFromWishlist } from '../Functions/HandleBackend'
import { RequireAuth } from '../Functions/HandleAuth'
import { Await, defer, useLoaderData, useSubmit } from 'react-router-dom'
import Listings from '../Components/Listings'
import Loading from '../Loading/Loading'

export async function action({ request }) {
    const formData = await request.formData();
    const productId = formData.get('productId');
    await removeFromWishlist(productId)
    return null;
}

export async function loader({ request }) {
    await RequireAuth(request)
    return defer({ dataSet: fetchUserWishlist() })
}

export default function WishList() {

    const dataSetPromise = useLoaderData();
    const submit = useSubmit();

    async function removeWishlist(productId, event) {
        event.preventDefault()
        submit({ productId }, { method: 'DELETE', replace: true });
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {dataSetLoaded => {
                    return dataSetLoaded.length > 0 ?
                        <Listings data={dataSetLoaded} isWishlist={true} removeWishlist={removeWishlist} /> :
                        <h2 style={{ marginTop: '7rem', textAlign: 'center' }}>Your wishlist is empty</h2>
                }}
            </Await>
        </Suspense>
    )
}
