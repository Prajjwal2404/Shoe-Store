import React, { useEffect, useRef, useState } from 'react'
import { Form, redirect, useNavigate, useNavigation, useOutletContext } from 'react-router-dom'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore/lite'
import { db, user } from '../../DB/FirebaseConfig'
import { CurrentUser } from '../../Functions/HandleUser'
import './Address.css'
import AddressCard from '../../Components/AddressCard'

export async function action({ request }) {
    const formData = await request.formData()
    if (formData.get('save')) {
        const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
        await updateDoc(userDocRef, {
            addresses: arrayUnion({
                fullName: formData.get('fullName'), phone: formData.get('phone'),
                street: formData.get('street'), pincode: formData.get('pincode'),
                city: formData.get('city'), state: formData.get('state')
            })
        })
        await orderPlaced()
        throw redirect('/cart?order=success')
    }
    else {
        await orderPlaced()
        throw redirect('/cart?order=success')
    }
}

async function orderPlaced() {
    const currentuser = await CurrentUser()
    const userObj = await user(currentuser.uid)
    const date = new Date()
    const items = userObj.cart.map(item => ({
        ...item, timeStamp: date, month: `${date.toLocaleString('default',
            { month: 'long' })} ${date.getFullYear()}`
    }))
    const userDocRef = doc(db, 'Users', currentuser.uid)
    await updateDoc(userDocRef, { cart: [] })
    await items.forEach(async item => await updateDoc(userDocRef, { orders: arrayUnion(item) }))
}

export default function AddressEl() {

    const navigation = useNavigation()
    const navigate = useNavigate()
    const ref = useRef([])
    const [addresses, setAddresses] = useState([])
    const [selectedAdd, setSelectedAdd] = useState('add0')
    const outletContext = useOutletContext()
    outletContext.getCartItems()

    useEffect(() => {
        const dataset = outletContext.dataSetLoaded
        const addressesArr = dataset.addresses.map((item, idx) =>
        (<AddressCard
            key={idx}
            fullName={item.fullName}
            phone={item.phone}
            street={item.street}
            pincode={item.pincode}
            city={item.city}
            state={item.state}
            value={`add${idx}`}
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
        await orderPlaced()
        navigate('/cart?order=success', { replace: true })
        event.target.textContent = 'Proceed to Payment'
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
