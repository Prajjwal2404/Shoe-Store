import React, { Suspense } from 'react'
import Listings from '../Components/Listings'
import { defer, useLoaderData, useSearchParams, Await } from 'react-router-dom';
import { fetchAllProducts } from '../Functions/HandleBackend';
import Loading from '../Loading/Loading';

export function loader() {
    return defer({ dataSet: fetchAllProducts() })
}

export default function Search() {
    const dataSetPromise = useLoaderData();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    return (
        <>
            <Suspense fallback={<Loading />}>
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
