import React from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

export default function AddressesCard({ fullName, phone, street, pincode, city, state, idx, remove }) {
    return (
        <div className='adds-card-div' >
            <IoMdCloseCircle className='adds-remove-icon' onClick={() => remove(idx)} />
            <h4>{fullName}</h4>
            <p>{street}</p>
            <p>{city}, {state} {pincode}</p>
            <p>Phone number: {phone}</p>
        </div>
    )
}
