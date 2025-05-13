import React, { useEffect, useRef, useState } from 'react'
import { Form, redirect, useNavigation, useOutletContext, useSubmit } from 'react-router-dom'
import { addUserAddress, fetchUserCart, clearCart, placeOrder } from '../../Functions/HandleBackend'
import AddressCard from '../../Components/AddressCard'
import './Address.css'

export async function action({ request }) {
    const formData = await request.formData()
    if (!formData.get('addressId')) {
        const addressObj = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), pincode: formData.get('pincode'),
            city: formData.get('city'), state: formData.get('state'), isSaved: formData.get('save') ? 1 : 0
        }
        const addressId = await addUserAddress(addressObj)
        await orderPlaced(addressId)
    } else {
        const addressId = formData.get('addressId')
        await orderPlaced(addressId)
    }
    throw redirect('/cart?order=success', { replace: true })
}

async function orderPlaced(addressId) {
    const userCart = await fetchUserCart()
    await placeOrder(addressId, userCart)
    await clearCart()
}

export default function AddressEl() {

    const navigation = useNavigation()
    const submit = useSubmit()
    const ref = useRef([])
    const [addresses, setAddresses] = useState([])
    const [selectedAdd, setSelectedAdd] = useState('')
    const outletContext = useOutletContext()

    useEffect(() => {
        const dataset = outletContext.addresses
        const addressesArr = dataset.map((item, idx) =>
        (<AddressCard
            key={idx}
            fullName={item.fullName}
            phone={item.phone}
            street={item.street}
            pincode={item.pincode}
            city={item.city}
            state={item.state}
            value={item.id}
            selected={selectedAdd}
            onChangeHandler={onChangeHandler} />)
        )
        setAddresses(addressesArr)
    }, [selectedAdd])

    function autoFill(event) {
        event.target.textContent = 'Getting location...'
        event.target.classList.add('location')
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const res = await fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}`)
            const { address } = await res.json()
            ref.current[1].value = address.road && address.neighbourhood ? `${address.road} ${address.neighbourhood}` :
                address.road ? address.road : address.neighbourhood ? address.neighbourhood : ref.current[1].value
            ref.current[2].value = address.postcode ? address.postcode : ref.current[2].value
            ref.current[3].value = address.city ? address.city : ref.current[3].value
            ref.current[4].value = address.state ? address.state : ref.current[4].value
            event.target.classList.remove('location')
            event.target.textContent = 'Autofill using current location'
        })
    }

    function onChangeHandler(event) {
        setSelectedAdd(event.target.value)
    }

    function showhide() {
        ref.current[0].classList.toggle('hidden')
        ref.current[5].classList.toggle('hidden')
    }

    async function proceed(event) {
        event.target.textContent = 'Proceeding...'
        submit({ addressId: selectedAdd }, { method: 'post' })
    }

    return (
        <div className='form-container'>
            <div className='wrapper-container'>
                <div className='add-wrapper' ref={el => ref.current[0] = el}>
                    <button className='autofill' onClick={autoFill}>Autofill using current location</button>
                    <Form className='add-form' method='post' replace>
                        <div className="add-input-div">
                            <input className='add-input' type="text" required name="fullName" placeholder='Name' />
                        </div>
                        <div className="add-input-div">
                            <input className='add-input' type="number" required name="phone" placeholder='Phone Number' />
                        </div>
                        <div className="add-input-div">
                            <input className='add-input' type="text" required name="street"
                                placeholder='Area, Street, House no.' ref={el => ref.current[1] = el} />
                        </div>
                        <div className="add-input-div">
                            <input className='add-input' type="number" required name="pincode" placeholder='Pincode'
                                ref={el => ref.current[2] = el} />
                        </div>
                        <div className='state-city-div'>
                            <div className="add-input-div small">
                                <input className='add-input' type="text" required name="city" placeholder='City'
                                    ref={el => ref.current[3] = el} />
                            </div>
                            <div className="add-input-div small">
                                <input className='add-input' type="text" required name="state" placeholder='State'
                                    ref={el => ref.current[4] = el} />
                            </div>
                        </div>
                        <div className="save-add">
                            <label><input type="checkbox" name="save" />Save</label>
                            <a className="saved-add" onClick={showhide}>Saved Addresses</a>
                        </div>
                        <button disabled={navigation.state === 'submitting'} type="submit" className="add-btn">
                            {navigation.state === 'submitting' ? 'Proceeding...' : 'Proceed to Payment'}
                        </button>
                    </Form>
                </div>
                <div className='saved-add-wrapper hidden' ref={el => ref.current[5] = el}>
                    <div className={`add-card-container ${addresses.length > 0 ? '' : 'empty'}`}>
                        {addresses.length > 0 ? addresses : <h2>No saved Address</h2>}
                    </div>
                    <a className='new-add' onClick={showhide}>New Address</a>
                    <button className='saved-add-btn' onClick={proceed}>Proceed to Payment</button>
                </div>
            </div>
        </div>
    )
}
