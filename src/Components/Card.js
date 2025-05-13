import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { IoMdCloseCircle } from 'react-icons/io'
import { getCurrentUserToken } from '../Functions/HandleAuth';
import { addToCart, fetchUserCart } from '../Functions/HandleBackend';
import Star from './Star';

export default function Card(props) {

    const navigate = useNavigate()
    const location = useLocation()
    const outletContext = useOutletContext()
    const [inCart, setInCart] = useState(false)

    async function handleClick(event) {
        event.preventDefault();
        const currentuser = getCurrentUserToken();
        if (currentuser) {
            let size
            if (props.gender === 'Male') size = 6
            else if (props.gender === 'Female') size = 3
            else size = 2

            await addToCart(props.id, 1, size)
            await outletContext.getCartItems()
            setInCart(true)
        }
        else {
            navigate(`/login?redirectTo=${location.pathname}`, { replace: true })
        }
    }

    useEffect(() => {
        async function checkCart() {
            const currentuser = getCurrentUserToken();
            if (currentuser) {
                const userCart = await fetchUserCart();
                if (userCart.find(e => e.id === props.id)) {
                    setInCart(true)
                }
            }
        }
        checkCart()
    }, [])


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
                    <Star className='stars' stars={Math.round(props.star)} />
                    <span className='total-reviews'>{`(${props.reviews} review${props.reviews > 1 ? 's' : ''})`}</span>
                </div>
                <section className='price'>
                    <div className='card-price'>
                        ${Number(props.newPrice).toFixed(0)}<del>${props.prevPrice}</del>
                    </div>
                    <div className={`bag ${inCart ? 'in-bag' : ''}`} onClick={handleClick}>
                        {inCart ? 'Added' : 'Add To Cart'}
                    </div>
                </section>
            </section>
        </Link>
    )
}
