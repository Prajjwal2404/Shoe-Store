import React, { useEffect, useRef, useState } from 'react'
import './Addresses.css'
import { Form, useActionData, useNavigation, useOutletContext } from 'react-router-dom';
import AddressesCard from './AddressesCard';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore/lite';
import { db, user } from '../../DB/FirebaseConfig';
import { CurrentUser } from '../../Functions/HandleUser';
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5'

var num = 0
export async function action({ request }) {
    const formData = await request.formData()
    const currentuser = await CurrentUser()
    const userDocRef = doc(db, 'Users', currentuser.uid)
    if (Number(formData.get('idx')) === -1) {
        await updateDoc(userDocRef, {
            addresses: arrayUnion({
                fullName: formData.get('fullName'), phone: formData.get('phone'),
                street: formData.get('street'), pincode: formData.get('pincode'),
                city: formData.get('city'), state: formData.get('state')
            })
        })
    }
    else {
        var addressArr = (await user(currentuser.uid)).addresses
        const addressObj = {
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), pincode: formData.get('pincode'),
            city: formData.get('city'), state: formData.get('state')
        }
        addressArr.splice(Number(formData.get('idx')), 1, addressObj)
        await updateDoc(userDocRef, { addresses: addressArr })
    }
    return ++num
}

export default function Addresses() {

    const navigation = useNavigation()
    const ref = useRef()
    const outletContext = useOutletContext()
    const [addresses, setAddresses] = useState(outletContext.dataSetLoaded.addresses)
    const [addressData, setAddressData] = useState({
        idx: -1, fullName: '', phone: '', street: '',
        pincode: '', city: '', state: ''
    })
    const action = useActionData()

    useEffect(() => {
        if (action) {
            closeAddress()
            refreshAddresses()
        }
    }, [action])

    var addressesCardArr = addresses.map((item, idx) =>
    (<AddressesCard
        key={idx}
        fullName={item.fullName}
        phone={item.phone}
        street={item.street}
        pincode={item.pincode}
        city={item.city}
        state={item.state}
        idx={idx}
        remove={remove}
        edit={editAddress} />
    ))

    addressesCardArr.reverse()

    async function remove(event, idx) {
        event.stopPropagation()
        const removeAdd = addresses[idx]
        const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
        await updateDoc(userDocRef, { addresses: arrayRemove(removeAdd) })
        setAddresses(prevAddresses => prevAddresses.filter((_, index) => index !== idx))
    }

    function autoFill(event) {
        event.target.textContent = 'Getting location...'
        event.target.classList.add('location')
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const res = await fetch(`https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}`)
            const { address } = await res.json()
            setAddressData(prevAddressData => {
                return {
                    ...prevAddressData,
                    street: address.road && address.neighbourhood ? `${address.road} ${address.neighbourhood}` : address.road ? address.road : address.neighbourhood ? address.neighbourhood : prevAddressData.street,
                    pincode: address.postcode ? address.postcode : prevAddressData.pincode,
                    city: address.city ? address.city : prevAddressData.city,
                    state: address.state ? address.state : prevAddressData.state
                }
            })
            event.target.classList.remove('location')
            event.target.textContent = 'Autofill using current location'
        })
    }

    function inputHandler(event) {
        const { name, value } = event.target
        setAddressData(prevAddressData => ({ ...prevAddressData, [name]: value }))
    }

    function refreshAddresses() {
        if (addressData.idx === -1) {
            setAddresses(prevAddresses => ([...prevAddresses, {
                fullName: addressData.fullName, phone: addressData.phone, street: addressData.street,
                pincode: addressData.pincode, city: addressData.city, state: addressData.state
            }]))
        }
        else {
            var addressObj = {
                fullName: addressData.fullName, phone: addressData.phone, street: addressData.street,
                pincode: addressData.pincode, city: addressData.city, state: addressData.state
            }
            var addressesObj = addresses
            addressesObj.splice(addressData.idx, 1, addressObj)
            setAddresses(addressesObj)
        }
    }

    function editAddress(idx) {
        window.scrollTo(0, 0);
        const editAdd = addresses[idx]
        setAddressData({ idx: idx, ...editAdd })
        ref.current.style.display = "block";
        setTimeout(() => ref.current.style.transform = "scale(1)", 100);
    }

    function addAddress() {
        window.scrollTo(0, 0);
        setAddressData({ idx: -1, fullName: '', phone: '', street: '', pincode: '', city: '', state: '' })
        ref.current.style.display = "block";
        setTimeout(() => ref.current.style.transform = "scale(1)", 100);
    }

    function closeAddress() {
        ref.current.style.transform = "scale(0)"
        setTimeout(() => ref.current.style.display = "none", 500);
    }

    return (
        <>
            <div className='adds-card-container'>
                <div className='add-new' onClick={addAddress}><AiFillPlusCircle /></div>
                {addressesCardArr.length > 0 ? addressesCardArr : <h2>No Saved Address</h2>}
            </div>
            <div className='adds-outerest'>
                <div className='adds-wrapper' ref={ref}>
                    <IoCloseOutline className='adds-close' onClick={closeAddress} />
                    <button className='adds-autofill' onClick={autoFill}>Autofill using current location</button>
                    <Form className='adds-form' method='post' replace>
                        <input className='id-input' type='number' name='idx' value={addressData.idx}
                            onChange={inputHandler} />
                        <div className="adds-input-div">
                            <input className='adds-input' type="text" required name="fullName" placeholder='Name'
                                value={addressData.fullName} onChange={inputHandler} />
                        </div>
                        <div className="adds-input-div">
                            <input className='adds-input' type="number" required name="phone" placeholder='Phone Number'
                                value={addressData.phone} onChange={inputHandler} />
                        </div>
                        <div className="adds-input-div">
                            <input className='adds-input' type="text" required name="street" value={addressData.street}
                                placeholder='Area, Street, House no.' onChange={inputHandler} />
                        </div>
                        <div className="adds-input-div">
                            <input className='adds-input' type="number" required name="pincode" placeholder='Pincode'
                                value={addressData.pincode} onChange={inputHandler} />
                        </div>
                        <div className='adds-state-city-div'>
                            <div className="adds-input-div small">
                                <input className='adds-input' type="text" required name="city" placeholder='City'
                                    value={addressData.city} onChange={inputHandler} />
                            </div>
                            <div className="adds-input-div small">
                                <input className='adds-input' type="text" required name="state" placeholder='State'
                                    value={addressData.state} onChange={inputHandler} />
                            </div>
                        </div>
                        <button disabled={navigation.state === 'submitting'} type="submit" className="adds-btn">
                            {addressData.idx > -1 ? (navigation.state === 'submitting' ? 'Updating...' :
                                'Update Address') : (navigation.state === 'submitting' ? 'Adding...' : 'Add new Address')}
                        </button>
                    </Form>
                </div>
            </div>
        </>
    )
}
