import React, { useEffect, useRef, useState } from 'react'
import { BiSolidSortAlt } from "react-icons/bi";
import SortItem from '../../Components/SortItem';
import './Sort.css'

export default function Sort({ handleSort, selected }) {

    const [btnText, setBtnText] = useState('Relevance');
    const options = useRef([]);

    function handleClick(event) {
        setBtnText(event.target.textContent);
        dropDown();
    }

    const [close, setClose] = useState(false)

    function dropDown() {
        if (close) {
            options.current[1].style.height = '0'
            setClose(false)
        }
        else {
            options.current[1].style.height = '8.5rem'
            setClose(true)
        }
    }

    useEffect(() => {
        function checkSort(event) {
            if (close && !options.current[0].contains(event.target) && !options.current[1].contains(event.target)) {
                dropDown()
            }
        }
        window.addEventListener('click', checkSort)
        return () => window.removeEventListener('click', checkSort)
    }, [close])


    return (
        <div className='sort-div'>
            <button className='sort' onClick={dropDown} ref={el => options.current[0] = el}>{btnText}</button>
            <div className='btndown'>
                <ul className='dropdown' ref={el => options.current[1] = el}>
                    <SortItem handleClick={handleClick} text='Relevance' handleSort={handleSort}
                        value='relevance' selected={selected} />
                    <SortItem handleClick={handleClick} text='Rating High to Low' handleSort={handleSort}
                        value='rating' selected={selected} />
                    <SortItem handleClick={handleClick} text='Price High to Low' handleSort={handleSort}
                        value='priceH' selected={selected} />
                    <SortItem handleClick={handleClick} text='Price Low to High' handleSort={handleSort}
                        value='priceL' selected={selected} />
                </ul>
            </div>
            <BiSolidSortAlt className='sort-icon' />
        </div>
    )
}
