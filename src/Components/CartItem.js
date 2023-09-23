import React from 'react'
import { Link } from 'react-router-dom'
import { IoMdCloseCircle } from 'react-icons/io'
import Select from './Select'

export default function CartItem(props) {
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
                    {props.isPlaced ?
                        <div className='order-selection-div'>
                            <p>SIZE (UK): {props.size}</p>
                            <p>QUANTITIY: {props.quantity}</p>
                        </div> :
                        <div className='cart-selection-div'>
                            <Select title='SIZE (UK)' min={6} max={12} id={props.id} selection={props.size}
                                handleClick={props.updateSize} />
                            <Select title='QUANTITIY' min={1} max={10} id={props.id} selection={props.quantity}
                                handleClick={props.updateQuantity} />
                        </div>}
                </section>
                <section className='cart-price-sec'>
                    <div className='cart-card-price'>
                        <p>${props.newPrice}.00</p>
                        <del>${props.prevPrice}.00</del>
                    </div>
                </section>
            </section>
        </Link>
    )
}
