import React from 'react'

export default function BrandItem(props) {
    return (
        <label className='brand-container'>
            <input type='radio' name='brand' value={props.value} onChange={props.handleBrand}
                checked={props.value === props.selected} />
            <span className='brand-btn'>
                {props.brand}
            </span>
        </label>
    )
}
