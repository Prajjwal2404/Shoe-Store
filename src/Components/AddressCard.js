import React from 'react'

export default function AddressCard({ fullName, phone, street, pincode, city, state, value, selected, onChangeHandler }) {
    return (
        <label className='add-card-label'>
            <input type='radio' name='address' value={value} onChange={onChangeHandler} checked={value === selected} />
            <div className='add-card-div' >
                <h4>{fullName}</h4>
                <p>{street}</p>
                <p>{city}, {state} {pincode}</p>
                <p>Phone number: {phone}</p>
            </div>
        </label>
    )
}
