import React from 'react'
import BrandItem from '../../Components/BrandItem';
import './Brands.css'

export default function Brands({ handleBrand, brandShown, selected }) {
    let brandlist = [];
    brandShown.forEach(product => {
        if (!brandlist.includes(product.company))
            brandlist.push(product.company);
    })
    let brands = brandlist.map((brand, idx) =>
        <BrandItem key={idx} value={brand} brand={brand} handleBrand={handleBrand} selected={selected} />);
    return (
        <div className='brands'>
            <BrandItem value='' brand='All Brands' handleBrand={handleBrand} selected={selected} />
            {brands}
        </div>
    )
}
