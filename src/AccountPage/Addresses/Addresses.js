import React, { useState } from 'react'
import './Addresses.css'
import { useOutletContext } from 'react-router-dom';
import AddressesCard from './AddressesCard';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore/lite';
import { db } from '../../DB/FirebaseConfig';
import { CurrentUser } from '../../Functions/HandleUser';

export default function Addresses() {

    const outletContext = useOutletContext();
    const [addresses, setAddresses] = useState(outletContext.dataSetLoaded.addresses)

    const addressesCardArr = addresses.map((item, idx) =>
    (<AddressesCard
        key={idx}
        fullName={item.fullName}
        phone={item.phone}
        street={item.street}
        pincode={item.pincode}
        city={item.city}
        state={item.state}
        idx={idx}
        remove={remove} />
    ))

    async function remove(idx) {
        const removeAdd = addresses[idx]
        setAddresses(prevAddresses => prevAddresses.filter((_, index) => index !== idx))
        const userDocRef = doc(db, 'Users', (await CurrentUser()).uid)
        await updateDoc(userDocRef, { addresses: arrayRemove(removeAdd) })
    }

    return (
        <div className='adds-card-container'>
            {addressesCardArr.length > 0 ? addressesCardArr : <h2>No Saved Address</h2>}
        </div>
    )
}
