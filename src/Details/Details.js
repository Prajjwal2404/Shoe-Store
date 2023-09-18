import React, { Suspense, useState } from 'react'
import { Await, defer, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore/lite';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import Select from '../Components/Select';
import Star from '../Components/Star';
import Review from './Reviews/Review';
import { product, db, user } from '../DB/FirebaseConfig';
import { CurrentUser } from '../Functions/HandleUser';
import './Details.css'

export function loader({ params }) {
    return defer({ product: product(params.id) })
}

export default function Details() {
    const product = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();
    const [added, setAdded] = useState(false)
    const [totalReview, setTotalReview] = useState({ star: 0, total: 0 })

    window.scrollTo(0, 0);

    function content(productLoaded) {

        async function check() {
            const currentuser = await CurrentUser()
            if (currentuser) {
                const userobj = await user(currentuser.uid)
                if (userobj.wishlist.includes(productLoaded.id)) {
                    setAdded(true)
                }
            }
        }

        check()

        async function addToWishlist() {
            const currentuser = await CurrentUser()
            if (currentuser) {
                const userDocRef = doc(db, 'Users', currentuser.uid)
                await updateDoc(userDocRef, { wishlist: arrayUnion(productLoaded.id) })
                setAdded(true)
            }
            else {
                navigate(`/login?redirectTo=${location.pathname}`)
            }
        }

        return <div className='details'>
            <BiArrowBack className='back-btn' onClick={() => navigate(-1)} />
            <div className='cover-div'>
                <img className='cover' src={productLoaded.img} />
            </div>
            <div className='info'>
                <div>
                    <p className='brand'>Brand: {productLoaded.company}</p>
                    <h1 className='title'>{productLoaded.title}</h1>
                </div>
                <div className='review'><Star className='stard' stars={totalReview.star} />
                    <p>{`(${totalReview.total} review${totalReview.total > 1 ? 's' : ''})`}</p></div>
                <div className='price-div'>
                    <h3>${productLoaded.newPrice}.00</h3>
                    <del>{productLoaded.prevPrice}</del>
                </div>
                <p className='description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis consectetur laudantium quaerat non harum placeat omnis. Distinctio, debitis sunt aliquid aut hic odio repellat quae porro, qui est, vitae perferendis!</p>
                <div className='selection'>
                    <Select title='SIZE (UK)' min={6} max={12} />
                    <Select title='QUANTITIY' min={1} max={10} />
                </div>
                <div className='btns'>
                    <button className='cart-btn'><BsFillCartFill className='icon-btn' />Add to Cart</button>
                    <button className={`wish-btn ${added ? 'wishlist-added' : ''}`} onClick={addToWishlist}>{added ? <AiFillHeart className='icon-btn' /> : <AiOutlineHeart />}{added ? 'Saved' : 'Save to Wishlist'}</button>
                </div>
                <h3 className='reviews-title'>Product Reviews</h3>
                <div className='product-reviews-div'>
                    <Review productId={productLoaded.id} sno={productLoaded.Sno} setTotal={setTotalReview}
                        navigate={navigate} location={location} />
                </div>
            </div>
        </div>
    }

    return (
        <Suspense fallback={<h2 style={{ textAlign: 'center', marginTop: '7rem' }}>Loading...</h2>}>
            <Await resolve={product.product}>
                {content}
            </Await>
        </Suspense >
    )
}
