import React, { Suspense } from 'react'
import Listings from '../Components/Listings'
import { data } from '../DB/FirebaseConfig'
import { Await, defer, useLoaderData } from 'react-router-dom';

export function loader() {
    return defer({ dataSet: data() })
}

export default function Home() {

    const dataSetPromise = useLoaderData();

    return (
        <>
            <Suspense fallback={<h2 style={{ textAlign: 'center', marginTop: '7rem' }}>Loading...</h2>}>
                <Await resolve={dataSetPromise.dataSet}>
                    {dataSetLoaded => <Listings data={dataSetLoaded} />}
                </Await>
            </Suspense>
        </>
    )
}
