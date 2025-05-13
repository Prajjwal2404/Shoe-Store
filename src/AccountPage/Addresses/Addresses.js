import React, { useEffect, useRef, useState } from 'react'
import { Form, redirect, useNavigation, useOutletContext, useSubmit } from 'react-router-dom';
import { addUserAddress, updateUserAddress, removeUserAddress } from '../../Functions/HandleBackend';
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5'
import AddressesCard from './AddressesCard';
import './Addresses.css'

export async function action({ request }) {
    const formData = await request.formData()
    if (Number(formData.get('idx')) === -1) {
        await addUserAddress({
            fullName: formData.get('fullName'), phone: formData.get('phone'),
            street: formData.get('street'), pincode: formData.get('pincode'),
            city: formData.get('city'), state: formData.get('state'), isSaved: 1
        })
    }
    else {
        if (request.method === 'DELETE') {
            await removeUserAddress(formData.get('idx'))
        }
        else {
            const addressObj = {
                fullName: formData.get('fullName'), phone: formData.get('phone'),
                street: formData.get('street'), pincode: formData.get('pincode'),
                city: formData.get('city'), state: formData.get('state')
            }
            await updateUserAddress(formData.get('idx'), addressObj)
        }
    }
    throw redirect('/account/addresses')
}

export default function Addresses() {

    const ref = useRef()
    const navigation = useNavigation()
    const outletContext = useOutletContext()
    const submit = useSubmit()
    const [addresses, setAddresses] = useState(outletContext.userAddresses)
    const [addressData, setAddressData] = useState({
        id: -1, fullName: '', phone: '', street: '',
        pincode: '', city: '', state: ''
    })

    useEffect(() => {
        closeAddress()
        setAddresses(outletContext.userAddresses)
    }, [outletContext.userAddresses])

    let addressesCardArr = addresses.map(item =>
    (<AddressesCard
        key={item.id}
        fullName={item.fullName}
        phone={item.phone}
        street={item.street}
        pincode={item.pincode}
        city={item.city}
        state={item.state}
        idx={item.id}
        remove={remove}
        edit={editAddress} />
    ))


    async function remove(event, idx) {
        event.stopPropagation()
        submit({ idx }, { method: 'delete', action: '/account', replace: true })
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

    function editAddress(idx) {
        window.scrollTo(0, 0);
        const editAdd = addresses.find(address => address.id === idx)
        setAddressData({ ...editAdd })
        ref.current.style.display = "block";
        setTimeout(() => ref.current.style.transform = "scale(1)", 100);
    }

    function addAddress() {
        window.scrollTo(0, 0);
        setAddressData({ id: -1, fullName: '', phone: '', street: '', pincode: '', city: '', state: '' })
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
                    <span className='adds-close' onClick={closeAddress}><IoCloseOutline /></span>
                    <button className='adds-autofill' onClick={autoFill}>Autofill using current location</button>
                    <Form className='adds-form' method='post' action='/account' replace>
                        <input className='id-input' type='number' name='idx' value={addressData.id}
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
                            {addressData.id > -1 ? (navigation.state === 'submitting' ? 'Updating...' :
                                'Update Address') : (navigation.state === 'submitting' ? 'Adding...' : 'Add new Address')}
                        </button>
                    </Form>
                </div>
            </div>
        </>
    )
}
