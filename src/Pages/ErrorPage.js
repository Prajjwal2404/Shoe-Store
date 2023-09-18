import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function Error() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <h1 style={{ textAlign: 'center', marginTop: '7rem', color: 'red' }}>Error: {error.message || error.data}</h1>
            <pre style={{ textAlign: 'center', marginTop: '1rem' }}>{error.status} - {error.statusText}</pre>
        </>
    )
}
