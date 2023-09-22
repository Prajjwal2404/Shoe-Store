import React from 'react'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

export default function Select({ title, min, max, id, selection, handleClick }) {

    return (
        <div className='select cart-select'>
            <p>{title}</p>
            <div className='select-div'>
                <span id='minus' onClick={(event) => handleClick(event, min, max, id)}><AiOutlineMinus className='icon' />
                </span>
                <p>{selection}</p>
                <span id='plus' onClick={(event) => handleClick(event, min, max, id)}><AiOutlinePlus className='icon' />
                </span>
            </div>
        </div>
    )
}
