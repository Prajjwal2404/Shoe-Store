import React from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

export default function AddressesCard({ fullName, phone, street, pincode, city, state, idx, remove, edit }) {
    return (
        <div className='adds-card-div' onClick={() => edit(idx)}>
            <IoMdCloseCircle className='adds-remove-icon' onClick={(event) => remove(event, idx)} />
            <h4>{fullName}</h4>
            <p>{street}</p>
            <p>{city}, {state} {pincode}</p>
            <p>Phone number: {phone}</p>
        </div>
    )
}
