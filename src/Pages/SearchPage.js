import React, { Suspense } from 'react'
import Listings from '../Components/Listings'
import { defer, useLoaderData, useSearchParams, Await } from 'react-router-dom';
import { data } from '../DB/FirebaseConfig';

export function loader() {
    return defer({ dataSet: data() })
}

export default function Search() {
    const dataSetPromise = useLoaderData();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    return (
        <>
            <Suspense fallback={<h2 style={{ textAlign: 'center', marginTop: '7rem' }}>Loading...</h2>}>
                <Await resolve={dataSetPromise.dataSet}>
                    {dataSetLoaded => {
                        const products = dataSetLoaded.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()));
                        return (products.length > 0) ? <Listings data={products} /> :
                            <h1 style={{ textAlign: 'center', marginTop: '7rem' }}>No Products Found!</h1>
                    }}
                </Await>
            </Suspense>
        </>
    )
}
