import React, { useEffect, useState } from 'react'
import { Link, useOutletContext, useSubmit } from 'react-router-dom'
import { updateCartItem, removeFromCart, fetchProductById } from '../../Functions/HandleBackend'
import CartItem from '../../Components/CartItem'
import './Cart.css'

export async function action({ request }) {
    const formData = await request.formData()
    const id = formData.get('id')
    if (request.method === 'DELETE') {
        await removeFromCart(id)
    } else {
        const quantity = formData.get('quantity')
        const size = formData.get('size')
        await updateCartItem(id, quantity, size)
    }
    return null
}

export default function CartEl() {

    const [cartDataSet, setCartDataSet] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState({ amount: 0, saving: 0 })
    const outletContext = useOutletContext()
    const submit = useSubmit()

    useEffect(() => {
        async function fetchData() {
            await outletContext.getCartItems()
            const dataset = outletContext.cart
            const cartItemArr = await Promise.all(dataset.map(async (cartItem) => await fetchProductById(cartItem.id)))
            setCartItems(cartItemArr)
            setCartDataSet(dataset)
        }
        fetchData()
    }, [outletContext.cart])

    const totalAmount = total.amount + 10

    useEffect(() => {
        let totalAmount = 0
        let noDiscount = 0
        cartItems.forEach((item, idx) => {
            totalAmount += item.newPrice * cartDataSet[idx].quantity
            noDiscount += item.prevPrice * cartDataSet[idx].quantity
        })
        setTotal({ amount: totalAmount, saving: noDiscount - totalAmount })
    }, [cartDataSet])


    const cartProducts = cartItems.map(({ id, img, company, title, prevPrice, newPrice, gender }, idx) => (
        <CartItem
            key={id}
            id={id}
            img={img}
            company={company}
            title={title}
            prevPrice={prevPrice}
            newPrice={newPrice}
            removeItem={removeItem}
            gender={gender}
            size={cartDataSet[idx].size}
            quantity={cartDataSet[idx].quantity}
            updateSize={updateSize}
            updateQuantity={updateQuantity} />
    ))

    function updateSize(event, min, max, id) {
        event.preventDefault();
        const elemId = event.target.id;
        const cartItem = cartDataSet.find(item => item.id === id)
        const size = (elemId === 'minus' && cartItem.size > min) ? Number(cartItem.size) - 1 :
            (elemId === 'plus' && cartItem.size < max) ? Number(cartItem.size) + 1 : cartItem.size
        if (size === cartItem.size) return
        submit({ id, quantity: cartItem.quantity, size }, { method: 'PUT', action: '/cart', replace: true })
    }

    function updateQuantity(event, min, max, id) {
        event.preventDefault();
        const elemId = event.target.id;
        const cartItem = cartDataSet.find(item => item.id === id)
        const quantity = (elemId === 'minus' && cartItem.quantity > min) ? cartItem.quantity - 1 :
            (elemId === 'plus' && cartItem.quantity < max) ? cartItem.quantity + 1 : cartItem.quantity
        if (quantity === cartItem.quantity) return
        submit({ id, quantity, size: cartItem.size }, { method: 'PUT', action: '/cart', replace: true })
    }

    function removeItem(id, event) {
        event.preventDefault();
        submit({ id }, { method: 'DELETE', action: '/cart', replace: true })
    }


    return (
        <div className='cart-div'>
            <div className='cart-item-div'>
                {cartProducts}
            </div>
            <div className='payment-div'>
                <h3>ORDER TOTAL</h3>
                <span><p>Sub-total</p><p>${total.amount}.00</p></span>
                <span><p>Delivery fee</p><p>$10.00</p></span>
                <span><p>Saved</p><p>${total.saving}.00</p></span>
                <hr />
                <span><p>Grand Total</p><p>${totalAmount}.00</p></span>
                <Link to={'address'} className='checkout-btn'>Checkout</Link>
            </div>
        </div>
    )
}
