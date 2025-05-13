import React, { Suspense } from 'react'
import Listings from '../Components/Listings'
import { fetchAllProducts } from '../Functions/HandleBackend'
import { Await, defer, useLoaderData } from 'react-router-dom';
import Loading from '../Loading/Loading';

export function loader() {
    return defer({ dataSet: fetchAllProducts() })
}

export default function Women() {

    const dataSetPromise = useLoaderData();

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {dataSetLoaded => {
                    const dataset = dataSetLoaded.filter(product => product.gender === 'Female')
                    return <Listings data={dataset} isFemale={true} />
                }}
            </Await>
        </Suspense>
    )
}