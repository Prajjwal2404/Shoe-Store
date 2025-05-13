import React, { useEffect, useState } from 'react'
import { useActionData, useNavigation, useSubmit } from 'react-router-dom'
import StarRating from '../../Components/StarRating'
import Star from '../../Components/Star'
import './Review.css'

export default function Review({ reviews }) {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewElems, setReviewElems] = useState([]);
    const { formData, state } = useNavigation();
    const actionData = useActionData();
    const submit = useSubmit();

    useEffect(() => {
        let reviewArray = reviews;
        reviewArray = reviewArray.sort((a, b) => b.createdAt - a.createdAt)
        const reviewElemsArr = reviewArray.map((review, idx) => {
            return (<div key={idx} className='reviews-div'>
                <h4>{review.name}</h4>
                <div><Star stars={review.rating} className='review-star' /></div>
                <p>{review.comment}</p>
                <hr />
            </div>)
        })
        setReviewElems(reviewElemsArr)
    }, [reviews])

    useEffect(() => {
        if (actionData?.reviewSubmitted) {
            setRating(0)
            setReview('')
        }
    }, [actionData])

    async function submitReview() {
        if (rating && review) {
            submit({ action: 'submitReview', rating, review }, { method: 'post', replace: true });
        }
    }

    return (
        <>
            <div className='reviews-container'>
                {reviewElems.length > 0 ? reviewElems : (<><p style={{ textAlign: 'center' }}>No Reviews</p><hr /></>)}
            </div>
            <div className='review-submit'>
                <div className='rating-container-div'>
                    <div className='rating-container'>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <button onClick={submitReview}>
                        {state === 'submitting' && formData.get('action') === 'submitReview' ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
                <textarea placeholder='Enter your review' value={review} onChange={event => setReview(event.target.value)} />
            </div>
        </>
    )
}
