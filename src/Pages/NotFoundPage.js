import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {

    const style = {
        marginTop: '7rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'
    }

    const button = {
        padding: '1rem 2rem', background: 'black', borderRadius: '15px', color: '#dadada', fontWeight: 'bold'
    }

    return (
        <div style={style}>
            <h1 style={{ textAlign: 'center' }}>Sorry, the page you were looking for was not found.</h1>
            <Link to={'/'} style={button}>Return to Home</Link>
        </div>
    )
}
