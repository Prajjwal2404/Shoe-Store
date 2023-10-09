import React, { useEffect, useState } from 'react'
import './Orders.css'
import { useOutletContext } from 'react-router-dom'
import { product } from '../../DB/FirebaseConfig'
import CartItem from '../../Components/CartItem'

export default function Orders() {

    const outletContext = useOutletContext()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function fetchData() {
            const dataSet = outletContext.dataSetLoaded.orders
            var months = []
            dataSet.forEach(item => {
                if (!months.includes(item.month)) months.push(item.month)
            })
            months = months.sort((a, b) => {
                const dateA = new Date(a + '1')
                const dateB = new Date(b + '1')
                return dateB - dateA
            })
            const ordersArr = await Promise.all(months.map(async (month, index) => {
                var monthOrders = dataSet.filter(item => item.month === month)
                monthOrders = monthOrders.sort((a, b) => b.timeStamp - a.timeStamp)
                const orderItems = await Promise.all(monthOrders.map(async (monthOrder) => await product(monthOrder.id)))
                return (
                    <div className='orders-div' key={index}>
                        <h2>{month.toUpperCase()}</h2>
                        {orderItems.map(({ id, img, company, title, prevPrice, newPrice }, idx) => (
                            <CartItem
                                key={idx}
                                id={id}
                                img={img}
                                company={company}
                                title={title}
                                prevPrice={prevPrice}
                                newPrice={newPrice}
                                size={monthOrders[idx].size}
                                quantity={monthOrders[idx].quantity}
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
