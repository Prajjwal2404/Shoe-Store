import React, { Suspense } from 'react'
import Listings from '../Components/Listings'
import { data } from '../DB/FirebaseConfig'
import { Await, defer, useLoaderData } from 'react-router-dom';
import Loading from '../Loading/Loading';

export function loader() {
    return defer({ dataSet: data() })
}

export default function Kids() {

    const dataSetPromise = useLoaderData();

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Await resolve={dataSetPromise.dataSet}>
                    {dataSetLoaded => {
                        const dataset = dataSetLoaded.filter(product => product.gender === 'Kids')
                        return <Listings data={dataset} isKids={true} />
                    }}
                </Await>
            </Suspense>
        </>
    )
}