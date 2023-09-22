import React, { Suspense, useEffect, useState } from 'react'
import { Await, defer, useLoaderData, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore/lite';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsFillCartFill, BsFillCartCheckFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import Select from '../Components/Select';
import Star from '../Components/Star';
import Review from './Reviews/Review';
import { product, db, user } from '../DB/FirebaseConfig';
import { CurrentUser } from '../Functions/HandleUser';
import './Details.css'
import Loading from '../Loading/Loading';

export function loader({ params }) {
    return defer({ product: product(params.id) })
}

export default function Details() {
    const product = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();
    const outletContext = useOutletContext();
    const [size, setSize] = useState(6);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState({ wishlist: false, cart: false })
    const [totalReview, setTotalReview] = useState({ star: 0, total: 0 })

    window.scrollTo(0, 0);

    useEffect(() => {
        async function check() {
            const productLoaded = await product.product
            const currentuser = await CurrentUser()
            if (currentuser) {
                const userobj = await user(currentuser.uid)
                if (userobj.wishlist.includes(productLoaded.id)) {
                    setAdded(prevAdded => ({ ...prevAdded, wishlist: true }))
                }
                if (userobj.cart.find(e => e.id === productLoaded.id)) {
                    setAdded(prevAdded => ({ ...prevAdded, cart: true }))
                }
            }
            await outletContext.getCartItems()
        }
        check()
    }, [])

    function content(productLoaded) {

        async function addToWishlist() {
            const currentuser = await CurrentUser()
            if (currentuser) {
                const userDocRef = doc(db, 'Users', currentuser.uid)
                await updateDoc(userDocRef, { wishlist: arrayUnion(productLoaded.id) })
                setAdded(prevAdded => ({ ...prevAdded, wishlist: true }))
            }
            else {
                navigate(`/login?redirectTo=${location.pathname}`)
            }
        }


        async function addToCart() {
            const currentuser = await CurrentUser()
            if (currentuser) {
                const userDocRef = doc(db, 'Users', currentuser.uid)
                await updateDoc(userDocRef,
                    { cart: arrayUnion({ id: productLoaded.id, quantity: quantity, size: size }) })
                await outletContext.getCartItems()
                setAdded(prevAdded => ({ ...prevAdded, cart: true }))
            }
            else {
                navigate(`/login?redirectTo=${location.pathname}`)
            }
        }


        function handleClickSize(event, min, max) {
            const id = event.target.id;
            setSize(prevSize => (id === 'minus' && prevSize > min) ? prevSize - 1 :
                (id === 'plus' && prevSize < max) ? prevSize + 1 : prevSize)
        }

        function handleClickQuantity(event, min, max) {
            const id = event.target.id;
            setQuantity(prevQuantity => (id === 'minus' && prevQuantity > min) ? prevQuantity - 1 :
                (id === 'plus' && prevQuantity < max) ? prevQuantity + 1 : prevQuantity)
        }


        return (
            <div className='details'>
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
                        <del>${productLoaded.prevPrice}.00</del>
                    </div>
                    <p className='description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis consectetur laudantium quaerat non harum placeat omnis. Distinctio, debitis sunt aliquid aut hic odio repellat quae porro, qui est, vitae perferendis!</p>
                    <div className='selection'>
                        <Select title='SIZE (UK)' min={6} max={12} selection={size}
                            handleClick={handleClickSize} />
                        <Select title='QUANTITIY' min={1} max={10} selection={quantity}
                            handleClick={handleClickQuantity} />
                    </div>
                    <div className='btns'>
                        <button className={`cart-btn ${added.cart ? 'added' : ''}`} onClick={addToCart}>
                            {added.cart ? <BsFillCartCheckFill /> : <BsFillCartFill className='icon-btn' />}
                            {added.cart ? 'Added' : 'Add to Cart'}</button>
                        <button className={`wish-btn ${added.wishlist ? 'added' : ''}`} onClick={addToWishlist}>
                            {added.wishlist ? <AiFillHeart /> : <AiOutlineHeart className='icon-btn' />}
                            {added.wishlist ? 'Saved' : 'Save to Wishlist'}</button>
                    </div>
                    <h3 className='reviews-title'>Product Reviews</h3>
                    <div className='product-reviews-div'>
                        <Review productId={productLoaded.id} sno={productLoaded.Sno} setTotal={setTotalReview}
                            navigate={navigate} location={location} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={product.product}>
                {content}
            </Await>
        </Suspense >
    )
}
