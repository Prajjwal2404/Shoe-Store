import React from 'react'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function Star({ stars, className }) {
    let starRating = [];
    for (let i = 0; i < 5; i++) {
        stars > 0 ? starRating.push(<AiFillStar className={className} color='goldenrod' key={stars} />) : starRating.push(<AiOutlineStar className={className} key={stars} />);
        stars--;
    }

    return (
        <>
            {starRating}
        </>
    )
}
