import React, { Suspense, useEffect, useState } from 'react'
import { Await, defer, redirect, useActionData, useLoaderData, useNavigate, useOutletContext, useSubmit } from 'react-router-dom'
import { fetchProductById, fetchProductReviews, fetchUserCart, fetchUserWishlist, addToCart, addToWishlist, addProductReview, updateTotalProductReviews } from '../Functions/HandleBackend';
import { getCurrentUserToken } from '../Functions/HandleAuth';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsFillCartFill, BsFillCartCheckFill } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import Select from '../Components/Select';
import Star from '../Components/Star';
import Review from './Reviews/Review';
import Loading from '../Loading/Loading';
import './Details.css'

export async function action({ request, params }) {
    const currentuser = getCurrentUserToken();
    if (!currentuser) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/login?redirectTo=${pathname}`);
    }

    const productId = params.id;
    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'addToCart') {
        const quantity = formData.get('quantity');
        const size = formData.get('size');
        await addToCart(productId, quantity, size);
        return { cartUpdated: true };
    }
    else if (action === 'addToWishlist') {
        await addToWishlist(productId);
        return null;
    }
    else if (action === 'submitReview') {
        const review = formData.get('review');
        const rating = formData.get('rating');
        await addProductReview(productId, rating, review);
        const reviews = await fetchProductReviews(productId);
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
        await updateTotalProductReviews(productId, totalReviews, totalRating.toFixed(2));
        return { reviewSubmitted: true };
    }
    return null;
}

export function loader({ params }) {
    const currentuser = getCurrentUserToken();
    if (currentuser) return defer({ product: [fetchProductById(params.id), fetchProductReviews(params.id), fetchUserCart(), fetchUserWishlist()] });
    else return defer({ product: [fetchProductById(params.id), fetchProductReviews(params.id)] });
}

export default function Details() {
    const product = useLoaderData();
    const actionData = useActionData();
    const outletContext = useOutletContext();

    useEffect(() => {
        if (actionData?.cartUpdated) outletContext.getCartItems();
    }, [actionData]);

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={Promise.all(product.product)}>
                {productDataLoaded => {
                    return <Content productData={productDataLoaded} />
                }}
            </Await>
        </Suspense >
    )
}

function Content({ productData }) {

    const submit = useSubmit();
    const navigate = useNavigate();
    const [size, setSize] = useState();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState({ wishlist: false, cart: false });
    const productLoaded = productData[0];

    useEffect(() => {
        if (productLoaded.gender === 'Male') setSize(6)
        else if (productLoaded.gender === 'Female') setSize(3)
        else setSize(2)
    }, [productLoaded]);

    useEffect(() => {
        if (productData.length > 2) {
            const userCart = productData[2];
            if (userCart.find(e => e.id === productLoaded.id)) {
                setAdded(prevAdded => ({ ...prevAdded, cart: true }));
            }
            const userWhishlist = productData[3];
            if (userWhishlist.find(e => e.id === productLoaded.id)) {
                setAdded(prevAdded => ({ ...prevAdded, wishlist: true }));
            }
        }
    }, [productData]);

    async function handleAddToWishlist() {
        submit({ action: 'addToWishlist' }, { method: 'POST', replace: true });
    }


    async function handleAddToCart() {
        submit({ action: 'addToCart', quantity, size }, { method: 'POST', replace: true });
    }


    let max, min
    if (productLoaded.gender === 'Male') {
        max = 13
        min = 6
    }

    else if (productLoaded.gender === 'Female') {
        max = 9
        min = 3
    }

    else {
        max = 13
        min = 2
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
                <div className='review'><Star className='stard' stars={Math.round(productLoaded.star)} />
                    <p>{`(${productLoaded.reviews} review${productLoaded.reviews > 1 ? 's' : ''})`}</p></div>
                <div className='price-div'>
                    <h3>${productLoaded.newPrice}</h3>
                    <del>${productLoaded.prevPrice}</del>
                </div>
                <p className='description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis consectetur laudantium quaerat non harum placeat omnis. Distinctio, debitis sunt aliquid aut hic odio repellat quae porro, qui est, vitae perferendis!</p>
                <div className='selection'>
                    <Select title='SIZE (UK)' min={min} max={max} selection={size}
                        handleClick={handleClickSize} />
                    <Select title='QUANTITIY' min={1} max={10} selection={quantity}
                        handleClick={handleClickQuantity} />
                </div>
                <div className='btns'>
                    <button className={`cart-btn ${added.cart ? 'added' : ''}`} onClick={handleAddToCart}>
                        {added.cart ? <BsFillCartCheckFill /> : <BsFillCartFill className='icon-btn' />}
                        {added.cart ? 'Added' : 'Add to Cart'}</button>
                    <button className={`wish-btn ${added.wishlist ? 'added' : ''}`} onClick={handleAddToWishlist}>
                        {added.wishlist ? <AiFillHeart /> : <AiOutlineHeart className='icon-btn' />}
                        {added.wishlist ? 'Saved' : 'Save to Wishlist'}</button>
                </div>
                <h3 className='reviews-title'>Product Reviews</h3>
                <div className='product-reviews-div'>
                    <Review reviews={productData[1]} />
                </div>
            </div>
        </div>
    )
}
