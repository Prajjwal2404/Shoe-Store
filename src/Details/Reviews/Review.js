import React, { useEffect, useState } from 'react'
import StarRating from '../../Components/StarRating'
import { db, user } from '../../DB/FirebaseConfig'
import { CurrentUser } from '../../Functions/HandleUser'
import { setDoc, doc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore/lite'
import './Review.css'
import Star from '../../Components/Star'

export default function Review({ productId, sno, setTotal, navigate, location }) {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewElems, setReviewElems] = useState([]);
    const [submitted, setSubmitted] = useState(0);

    useEffect(() => {
        async function fetchdata() {
            const reviewCollectionRef = collection(db, 'Reviews')
            const q = query(reviewCollectionRef, where('productId', '==', productId))
            const getReviews = await getDocs(q)
            var reviewArray = getReviews.docs.map(doc => ({ ...doc.data() }))
            reviewArray = reviewArray.sort((a, b) => b.timeStamp - a.timeStamp)
            const reviewElemsArr = await Promise.all(reviewArray.map(async (review, idx) => {
                return (<div key={idx} className='reviews-div'>
                    <h4>{(await user(review.userId)).username}</h4>
                    <div><Star stars={review.rating} className='review-star' /></div>
                    <p>{review.review}</p>
                    <hr />
                </div>)
            }))
            setReviewElems(reviewElemsArr)
            const averageStar = averageRating(reviewArray)
            setTotal({ star: averageStar, total: reviewArray.length })
            if (submitted > 0) {
                const productDocRef = doc(db, 'Shoes', productId)
                await updateDoc(productDocRef, { star: averageStar, reviews: reviewArray.length })
            }
        }
        fetchdata()
    }, [submitted])

    function averageRating(reviewArr) {
        let total = 0
        reviewArr.forEach(({ rating }) => total += rating)
        return (Math.round(total / reviewArr.length))
    }

    async function submitReview(event) {
        const currentuser = await CurrentUser();
        if (currentuser) {
            if (rating && review) {
                event.target.textContent = 'Submitting...'
                const reviewDocRef = doc(db, 'Reviews', `${(await user(currentuser.uid)).usernameLower}_${sno}`);
                await setDoc(reviewDocRef, {
                    userId: currentuser.uid, productId: productId,
                    rating: rating, review: review, timeStamp: serverTimestamp()
                });
                setRating(0)
                setReview('')
                setSubmitted(prevSubmited => prevSubmited + 1)
                event.target.textContent = 'Submit'
            }
        }
        else {
            navigate(`/login?redirectTo=${location.pathname}`)
        }
    }

    return (
        <>
            <div className='reviews-container'>
                {reviewElems.length != 0 ? reviewElems : (<><p style={{ textAlign: 'center' }}>No Reviews</p><hr /></>)}
            </div>
            <div className='review-submit'>
                <div className='rating-container-div'>
                    <div className='rating-container'>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <button onClick={submitReview}>Submit</button>
                </div>
                <textarea placeholder='Enter your review' value={review} onChange={event => setReview(event.target.value)} />
            </div>
        </>
    )
}
