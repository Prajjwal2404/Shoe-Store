import React from 'react'

export default function SortItem({ handleClick, text, handleSort, selected, value }) {
    return (
        <label>
            <li onClick={handleClick}>{text}</li>
            <input type='radio' name='sort' onChange={handleSort} checked={selected === value} value={value} />
        </label>
    )
}
