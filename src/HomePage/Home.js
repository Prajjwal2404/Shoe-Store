import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Await, defer, useLoaderData, useOutletContext } from 'react-router-dom'
import { data } from '../DB/FirebaseConfig'
import Loading from '../Loading/Loading'
import Card from '../Components/Card'
import './Home.css'

export function loader() {
    return defer({ dataSet: data() })
}

export default function Home() {

    const dataSetPromise = useLoaderData()
    const rd = useRef([])
    const outletContext = useOutletContext()
    const [slideShow, setSlideShow] = useState({ value: 0, scroll: false })
    const [stop, setStop] = useState(false)

    var counter = 0
    useEffect(() => {
        outletContext.getCartItems()
        function slider() {
            if (rd.current.length > 0) {
                for (let i = 0; i < rd.current.length - 2; i++) {
                    if (rd.current[i].checked === true) {
                        counter = i + 1
                        break
                    }
                }
                if (counter > 4) {
                    counter = 0
                }
                rd.current[5].scrollLeft = rd.current[6].offsetWidth * counter
                setSlideShow({ value: counter, scroll: false })
            }
        }
        const interval = setInterval(slider, 5000)
        if (stop) clearInterval(interval)
        return () => clearInterval(interval)
    }, [stop])

    useEffect(() => {
        var timer = null
        function scrollDetect() {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                if (slideShow.scroll) {
                    setSlideShow(prevSlideShow => ({
                        ...prevSlideShow,
                        value: Math.round(rd.current[5].scrollLeft / rd.current[6].offsetWidth)
                    }))
                    setStop(true)
                }
                else setSlideShow(prevSlideShow => ({ ...prevSlideShow, scroll: true }))
            }, 50)
        }
        if (rd.current.length > 0) rd.current[5].addEventListener('scroll', scrollDetect)
        return () => rd.current[5]?.removeEventListener('scroll', scrollDetect)
    }, [slideShow])

    function content(dataSetLoaded) {

        function handleChange(event) {
            rd.current[5].scrollLeft = rd.current[6].offsetWidth * event.target.value
            setSlideShow({ value: parseInt(event.target.value), scroll: false })
        }

        const fourtyOffArr = dataSetLoaded.filter(({ newPrice }) => newPrice === 150)
        const fourtyOffElems = fourtyOffArr.map(({ id, Sno, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={Sno}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const sixtyOffArr = dataSetLoaded.filter(({ newPrice }) => newPrice === 100)
        const sixtyOffElems = sixtyOffArr.map(({ id, Sno, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={Sno}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const hushArr = dataSetLoaded.filter(({ company }) => company === 'Hush Puppies')
        const hushElems = hushArr.map(({ id, Sno, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={Sno}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const pumaArr = dataSetLoaded.filter(({ company }) => company === 'Puma')
        const pumaElems = pumaArr.map(({ id, Sno, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={Sno}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))


        return (
            <div className='home-container'>
                <div className='outer-container'>
                    <div className='outer'>
                        <div className='slider' ref={el => rd.current[5] = el}>
                            <div className='slides'>
                                <input type='radio' name='radiobtn' id='radio1' ref={el => rd.current[0] = el}
                                    value={0} onChange={handleChange} checked={slideShow.value === 0} />
                                <input type='radio' name='radiobtn' id='radio2' ref={el => rd.current[1] = el}
                                    value={1} onChange={handleChange} checked={slideShow.value === 1} />
                                <input type='radio' name='radiobtn' id='radio3' ref={el => rd.current[2] = el}
                                    value={2} onChange={handleChange} checked={slideShow.value === 2} />
                                <input type='radio' name='radiobtn' id='radio4' ref={el => rd.current[3] = el}
                                    value={3} onChange={handleChange} checked={slideShow.value === 3} />
                                <input type='radio' name='radiobtn' id='radio5' ref={el => rd.current[4] = el}
                                    value={4} onChange={handleChange} checked={slideShow.value === 4} />

                                <div className='slide' ref={el => rd.current[6] = el}>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg1.jpeg?alt=media&token=23845229-387e-472a-9df0-b46b215b2ad2' className='img' />
                                </div>
                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg2.jpg?alt=media&token=383563fb-602e-42f2-a6c6-0de812483540' className='img' />
                                </div>
                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg3.jpeg?alt=media&token=16e6cd84-33e6-4a03-a0c1-307f25ebebda' className='img' />
                                </div>
                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg4.jpeg?alt=media&token=37f4e597-2453-4113-a465-8b5b29d32950' className='img' />
                                </div>
                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg5.jpeg?alt=media&token=0597b75e-da0c-4536-961d-9cde713712b2' className='img' />
                                </div>

                                <div className='navbackground'>
                                    <label htmlFor='radio1' className='manualnav lbl1'></label>
                                    <label htmlFor='radio2' className='manualnav lbl2'></label>
                                    <label htmlFor='radio3' className='manualnav lbl3'></label>
                                    <label htmlFor='radio4' className='manualnav lbl4'></label>
                                    <label htmlFor='radio5' className='manualnav lbl5'></label>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='more-div'>
                    <h2>40% OFF</h2>
                    <div className='more-card-div'>{fourtyOffElems}</div>
                </div>
                <div className='more-div'>
                    <h2>60% OFF</h2>
                    <div className='more-card-div'>{sixtyOffElems}</div>
                </div>
                <div className='more-div'>
                    <h2>HUSH PUPPIES</h2>
                    <div className='more-card-div'>{hushElems}</div>
                </div>
                <div className='more-div'>
                    <h2>PUMA</h2>
                    <div className='more-card-div'>{pumaElems}</div>
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <Await resolve={dataSetPromise.dataSet}>
                {content}
            </Await>
        </Suspense>
    )
}
