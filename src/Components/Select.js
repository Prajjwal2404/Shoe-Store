import React, { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export default function Select({ title, min, max }) {

    const [selection, setSelection] = useState(min);

    function handleClick(event) {
        const id = event.target.id;
        setSelection(prevSelection => (id === 'minus' && selection > min) ? prevSelection - 1 :
            (id === 'plus' && selection < max) ? prevSelection + 1 : prevSelection)
    }


    return (
        <div className='select'>
            <p>{title}</p>
            <div className='select-div'>
                <span id='minus' onClick={handleClick}><AiOutlineMinus className='icon' /></span>
                <p>{selection}</p>
                <span id='plus' onClick={handleClick}><AiOutlinePlus className='icon' /></span>
            </div>
        </div>
    )
}
