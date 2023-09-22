import React from 'react'
import Card from '../Components/Card'
import { useOutletContext } from 'react-router-dom';
import './Products.css'

export default function Products({ products, isWishlist, removeWishlist }) {
    let productlist = products.map(({ id, Sno, img, star, title, reviews, prevPrice, newPrice }) =>
    (<Card
        key={Sno}
        id={id}
        img={img}
        star={star}
        title={title}
        reviews={reviews}
        prevPrice={prevPrice}
        newPrice={newPrice}
        isWishlist={isWishlist}
        removeWishlist={removeWishlist} />));

    const outletContext = useOutletContext()
    outletContext.getCartItems()

    return (
        <section className='card-container'>
            {productlist}
        </section>
    )
}
