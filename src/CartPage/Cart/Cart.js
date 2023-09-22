import React, { useEffect, useState } from 'react'
import CartItem from '../../Components/CartItem'
import { CurrentUser } from '../../Functions/HandleUser'
import { Link, useOutletContext } from 'react-router-dom'
import { db, product } from '../../DB/FirebaseConfig'
import { doc, updateDoc } from 'firebase/firestore/lite'
import './Cart.css'

export default function CartEl() {

    const [cartDataSet, setCartDataSet] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState({ amount: 0, saving: 0 })
    const [updated, setUpdated] = useState(0)
    const outletContext = useOutletContext()

    useEffect(() => {
        async function fetchData() {
            const dataset = outletContext.dataSetLoaded
            const cartItemArr = await Promise.all(dataset.cart.map(async (cartItem) => await product(cartItem.id)))
            setCartItems(cartItemArr)
            setCartDataSet(dataset.cart)
            await outletContext.getCartItems()
        }
        fetchData()
    }, [])

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

    useEffect(() => {
        async function updateCart() {
            if (updated > 0) {
                const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
                await updateDoc(userDocRef, { cart: cartDataSet })
                await outletContext.getCartItems()
                if (!cartDataSet.length > 0) outletContext.setEmpty(true)
            }
        }
        updateCart()
    }, [updated])


    const cartProducts = cartItems.map(({ id, Sno, img, company, title, prevPrice, newPrice }, idx) => (
        <CartItem
            key={Sno}
            id={id}
            img={img}
            company={company}
            title={title}
            prevPrice={prevPrice}
            newPrice={newPrice}
            removeItem={removeItem}
            size={cartDataSet[idx].size}
            quantity={cartDataSet[idx].quantity}
            updateSize={updateSize}
            updateQuantity={updateQuantity} />
    ))

    function updateSize(event, min, max, id) {
        event.preventDefault();
        const elemId = event.target.id;
        setCartDataSet(prevCartDataSet => prevCartDataSet.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    size: ((elemId === 'minus' && item.size > min) ? item.size - 1 :
                        (elemId === 'plus' && item.size < max) ? item.size + 1 : item.size)
                }
            }
            else {
                return item
            }
        }))
        setUpdated(updated + 1)
    }

    function updateQuantity(event, min, max, id) {
        event.preventDefault();
        const elemId = event.target.id;
        setCartDataSet(prevCartDataSet => prevCartDataSet.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: ((elemId === 'minus' && item.quantity > min) ? item.quantity - 1 :
                        (elemId === 'plus' && item.quantity < max) ? item.quantity + 1 : item.quantity)
                }
            }
            else {
                return item
            }
        }))
        setUpdated(updated + 1)
    }

    function removeItem(id, event) {
        event.preventDefault();
        let tempItemsArr = cartItems.filter(item => item.id !== id)
        setCartItems(tempItemsArr)
        let tempDataSetArr = cartDataSet.filter(item => item.id !== id)
        setCartDataSet(tempDataSetArr)
        setUpdated(updated + 1)
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
