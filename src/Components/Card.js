import React, { useEffect, useState } from 'react'
import Star from './Star';
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { IoMdCloseCircle } from 'react-icons/io'
import { CurrentUser } from '../Functions/HandleUser';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore/lite';
import { db, user } from '../DB/FirebaseConfig';

export default function Card(props) {

    const navigate = useNavigate()
    const location = useLocation()
    const outletContext = useOutletContext()
    const [inCart, setInCart] = useState(false)

    async function handleClick(event) {
        event.preventDefault();
        const currentuser = await CurrentUser();
        if (currentuser) {
            var size
            if (props.gender === 'Male') size = 6
            else if (props.gender === 'Female') size = 3
            else size = 2

            const userDocRef = doc(db, 'Users', currentuser.uid)
            await updateDoc(userDocRef, { cart: arrayUnion({ id: props.id, quantity: 1, size: size }) })
            await outletContext.getCartItems()
            setInCart(true)
        }
        else {
            navigate(`/login?redirectTo=${location.pathname}`)
        }
    }

    useEffect(() => {
        async function checkCart() {
            const currentuser = await CurrentUser();
            if (currentuser) {
                const userObj = await user(currentuser.uid);
                if (userObj.cart.find(e => e.id === props.id)) {
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
                    <Star className='stars' stars={props.star} />
                    <span className='total-reviews'>{`(${props.reviews} review${props.reviews > 1 ? 's' : ''})`}</span>
                </div>
                <section className='price'>
                    <div className='card-price'>
                        ${props.newPrice}<del>${props.prevPrice}.00</del>
                    </div>
                    <div className={`bag ${inCart ? 'in-bag' : ''}`} onClick={handleClick}>
                        {inCart ? 'Added' : 'Add To Cart'}
                    </div>
                </section>
            </section>
        </Link>
    )
}
