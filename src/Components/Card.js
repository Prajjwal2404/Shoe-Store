import React from 'react'
import Star from './Star';
import { Link } from 'react-router-dom';
import { IoMdCloseCircle } from 'react-icons/io'

export default function Card(props) {

    function handleClick(event) {
        event.preventDefault();
        event.target.style.background = 'green';
        event.target.style.pointerEvents = 'none';
        event.target.textContent = 'Added';
    }

    return (
        <Link to={`/details/${props.id}`}>
            <section className='card'>
                {props.isWishlist && <IoMdCloseCircle className='close'
                    onClick={(event) => props.removeWishlist(props.id, event)} />}
                <div className='img-div'>
                    <img src={props.img} alt={props.title} className='card-img' />
                </div>
                <div className='card-details'>
                    <h3>{props.title}</h3>
                </div>
                <div className='reviews'>
                    <Star className='stars' stars={props.star} />
                    <span className='total-reviews'>{`(${props.reviews} review${props.reviews > 1 ? 's' : ''})`}</span>
                </div>
                <section className='price'>
                    <div className='card-price'>
                        ${props.newPrice}<del>{props.prevPrice}</del>
                    </div>
                    <div className='bag' onClick={handleClick}>
                        Add To Cart
                    </div>
                </section>
            </section>
        </Link>
    )
}
