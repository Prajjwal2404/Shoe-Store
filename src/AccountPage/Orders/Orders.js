import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { fetchProductById } from '../../Functions/HandleBackend'
import CartItem from '../../Components/CartItem'
import './Orders.css'

export default function Orders() {

    const outletContext = useOutletContext()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function fetchData() {
            const dataSet = outletContext.userOrders
            var months = []
            dataSet.forEach(item => {
                const date = new Date(item.orderDate)
                const month = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
                item.month = month
                if (!months.includes(month)) months.push(month)
            })
            months = months.sort((a, b) => {
                const dateA = new Date(a + '1')
                const dateB = new Date(b + '1')
                return dateB - dateA
            })
            const ordersArr = await Promise.all(months.map(async (month, index) => {
                var monthOrders = dataSet.filter(item => item.month === month)
                monthOrders = monthOrders.sort((a, b) => b.orderDate - a.orderDate)
                const orderItems = await Promise.all(monthOrders.map(async (monthOrder) =>
                    await Promise.all(monthOrder.items.map(async (order) => {
                        const productInfo = await fetchProductById(order.productId)
                        return { ...productInfo, quantity: order.quantity, size: order.size }
                    }))))
                const orderItemsArr = orderItems.flat()
                return (
                    <div className='orders-div' key={index}>
                        <h2>{month.toUpperCase()}</h2>
                        {orderItemsArr.map(({ id, img, company, title, prevPrice, newPrice, size, quantity }, idx) => (
                            <CartItem
                                key={idx}
                                id={id}
                                img={img}
                                company={company}
                                title={title}
                                prevPrice={prevPrice}
                                newPrice={newPrice}
                                size={size}
                                quantity={quantity}
                                isPlaced={true} />
                        ))}
                    </div>
                )
            }))
            setOrders(ordersArr)
        }
        fetchData()
    }, [])


    return (
        <div className='orders-container'>{orders.length > 0 ? orders : <h2>No Order History</h2>}</div>
    )
}
