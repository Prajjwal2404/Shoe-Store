import React from 'react'
import Card from '../Components/Card'
import './Products.css'

export default function Products({ products, isWishlist, removeWishlist }) {
    let productlist = products.map(({ id, img, star, title, reviews, prevPrice, newPrice, gender }) =>
    (<Card
        key={id}
        id={id}
        img={img}
        star={star}
        title={title}
        reviews={reviews}
        prevPrice={prevPrice}
        newPrice={newPrice}
        gender={gender}
        isWishlist={isWishlist}
        removeWishlist={removeWishlist} />));

    return (
        <section className='card-container'>
            {productlist}
        </section>
    )
}
