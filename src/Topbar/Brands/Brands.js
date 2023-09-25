import React from 'react'
import BrandItem from '../../Components/BrandItem';
import { IoFilterCircleSharp } from "react-icons/io5";
import './Brands.css'

export default function Brands({ handleBrand, brandShown, selected, myref, isMobile }) {
    let brandlist = [];
    brandShown.forEach(product => {
        if (!brandlist.includes(product.company))
            brandlist.push(product.company);
    })
    let brands = brandlist.map((brand, idx) =>
        <BrandItem key={idx} value={brand} brand={brand} handleBrand={handleBrand} selected={selected} />);

    function handleSidebar() {
        myref.current[0].classList.add('show')
    }

    return (
        <div className='brands'>
            {isMobile && <div ref={el => myref.current[1] = el}><IoFilterCircleSharp className='filter-icon'
                onClick={handleSidebar} /></div>}
            <BrandItem value='' brand='All Brands' handleBrand={handleBrand} selected={selected} />
            {brands}
        </div>
    )
}
