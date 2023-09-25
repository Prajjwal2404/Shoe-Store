import React from 'react'
import { Link } from 'react-router-dom'
import { IoMdCloseCircle } from 'react-icons/io'
import Select from './Select'
import HandleMedia from '../Functions/HandleMedia'

export default function CartItem(props) {

    const isMobile = HandleMedia('screen and (max-width: 800px) and (orientation: portrait)')

    var max, min
    if (props.gender === 'Male') {
        max = 13
        min = 6
    }

    else if (props.gender === 'Female') {
        max = 9
        min = 3
    }

    else {
        max = 13
        min = 2
    }

    return (
        <Link to={`/details/${props.id}`}>
            <section className='cart-card'>
                {!props.isPlaced && <IoMdCloseCircle className='remove-item'
                    onClick={(event) => props.removeItem(props.id, event)} />}
                <div className='cart-img-div'>
                    <img src={props.img} alt={props.title} className='cart-img' />
                </div>
                <section className='cart-details-sec'>
                    <div className='cart-brand-div'>
                        <p>Brand: {props.company}</p>
                    </div>
                    <div className='cart-card-details'>
                        <h3>{props.title}</h3>
                    </div>
                    {isMobile && <div className='cart-card-priceM'>
                        <p>${props.newPrice}.00</p>
                        <del>${props.prevPrice}.00</del>
                    </div>}
                    {props.isPlaced ?
                        <div className='order-selection-div'>
                            <p>SIZE (UK): {props.size}</p>
                            <p>QUANTITIY: {props.quantity}</p>
                        </div> :
                        <div className='cart-selection-div'>
                            <Select title='SIZE (UK)' min={min} max={max} id={props.id} selection={props.size}
                                handleClick={props.updateSize} />
                            <Select title='QUANTITIY' min={1} max={10} id={props.id} selection={props.quantity}
                                handleClick={props.updateQuantity} />
                        </div>}
                </section>
                {!isMobile && <section className='cart-price-sec'>
                    <div className='cart-card-price'>
                        <p>${props.newPrice}.00</p>
                        <del>${props.prevPrice}.00</del>
                    </div>
                </section>}
            </section>
        </Link>
    )
}
