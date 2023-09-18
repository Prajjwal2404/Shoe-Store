import React from 'react'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function StarRating({ rating, setRating }) {

    return (
        <>
            {
                [...Array(5)].map((_, index) => {
                    const currentRate = index + 1
                    return (
                        <div key={currentRate} className='star-rating-div'>
                            <label>
                                <input type='radio' name='starRating' value={currentRate}
                                    onClick={() => setRating(currentRate)} />
                                {currentRate <= rating ? <AiFillStar color='goldenrod' className='star-rate' /> :
                                    <AiOutlineStar className='star-rate' />}
                            </label>
                        </div>
                    )
                })
            }
        </>
    )
}
