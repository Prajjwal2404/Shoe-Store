import React from 'react'

export default function FilterItem(props) {
    return (
        <>
            <label className='label-container'>
                <input type='radio' name={props.name} value={props.value} onChange={props.onChangeHandler}
                    checked={props.value === props.selected} />
                <span className='checkmark' id={props.id}></span><p>{props.filter}</p>
            </label>
        </>
    )
}
