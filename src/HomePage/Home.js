import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Await, defer, useLoaderData } from 'react-router-dom'
import { fetchAllProducts } from '../Functions/HandleBackend'
import Loading from '../Loading/Loading'
import Card from '../Components/Card'
import './Home.css'

export function loader() {
    return defer({ dataSet: fetchAllProducts() })
}

export default function Home() {

    const dataSetPromise = useLoaderData()
    const rd = useRef([])
    const [slideShow, setSlideShow] = useState({ value: 0, scroll: true })
    const [stop, setStop] = useState(true)

    useEffect(() => {
        async function fetchData() {
            await dataSetPromise.dataSet
            setStop(false)
        }
        fetchData()
    }, [])

    useLayoutEffect(() => {
        if (!stop) {
            rd.current[5]?.scrollTo({ left: rd.current[5].offsetWidth, behavior: 'instant' })
            setSlideShow(prevSlideShow => ({ ...prevSlideShow, scroll: false }))
        }
    }, [stop])

    useEffect(() => {
        let counter = 0
        function slider() {
            if (rd.current.length > 0) {
                for (let i = 0; i < rd.current.length - 1; i++) {
                    if (rd.current[i].checked === true) {
                        counter = i + 1
                        break
                    }
                }
                rd.current[5].scrollLeft = rd.current[5].offsetWidth * (counter + 1)
                if (counter > 4) {
                    counter = 0
                    setTimeout(() => {
                        setSlideShow({ value: counter, scroll: false })
                        setTimeout(() => rd.current[5].scrollTo({
                            left: rd.current[5].offsetWidth,
                            behavior: 'instant'
                        }), 50)
                    }, 2450)
                }
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
                    if (Math.round(rd.current[5].scrollLeft) >= Math.round(rd.current[5].offsetWidth * 5.75)) {
                        rd.current[5].scrollTo({ left: rd.current[5].offsetWidth, behavior: 'instant' })
                    }
                    else if (Math.round(rd.current[5].scrollLeft) === 0) {
                        rd.current[5].scrollTo({ left: (rd.current[5].offsetWidth * 5), behavior: 'instant' })
                    }
                    var scrollPostion = Math.round(rd.current[5].scrollLeft / rd.current[5].offsetWidth) - 1
                    if (scrollPostion > 4) scrollPostion = 0
                    else if (scrollPostion < 0) scrollPostion = 4
                    setSlideShow(prevSlideShow => ({
                        ...prevSlideShow,
                        value: scrollPostion
                    }))
                    setStop(true)
                }
                else setSlideShow(prevSlideShow => ({ ...prevSlideShow, scroll: true }))
            }, 50)
        }
        rd.current[5]?.addEventListener('scroll', scrollDetect)
        return () => rd.current[5]?.removeEventListener('scroll', scrollDetect)
    }, [slideShow])

    function content(dataSetLoaded) {

        function handleChange(event) {
            rd.current[5].scrollLeft = rd.current[5].offsetWidth * (parseInt(event.target.value) + 1)
            setSlideShow({ value: parseInt(event.target.value), scroll: false })
        }

        const fourtyOffArr = dataSetLoaded.filter(({ newPrice }) => newPrice === '150.00')
        const fourtyOffElems = fourtyOffArr.map(({ id, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={id}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const sixtyOffArr = dataSetLoaded.filter(({ newPrice }) => newPrice === '100.00')
        const sixtyOffElems = sixtyOffArr.map(({ id, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={id}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const hushArr = dataSetLoaded.filter(({ company }) => company === 'Hush Puppies')
        const hushElems = hushArr.map(({ id, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={id}
            id={id}
            img={img}
            star={star}
            title={title}
            reviews={reviews}
            prevPrice={prevPrice}
            newPrice={newPrice}
            gender={gender} />))

        const pumaArr = dataSetLoaded.filter(({ company }) => company === 'Puma')
        const pumaElems = pumaArr.map(({ id, img, star, title, reviews, prevPrice, newPrice, gender }) =>
        (<Card
            key={id}
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

                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg5.jpeg?alt=media&token=0597b75e-da0c-4536-961d-9cde713712b2' className='img' />
                                </div>
                                <div className='slide'>
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
                                <div className='slide'>
                                    <img src='https://firebasestorage.googleapis.com/v0/b/shoe-store-160b2.appspot.com/o/home%2Fimg1.jpeg?alt=media&token=23845229-387e-472a-9df0-b46b215b2ad2' className='img' />
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
