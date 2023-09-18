import React from 'react'
import Category from './Category/Category'
import Price from './Price/Price'
import Color from './Color/Color'
import './Sidebar.css'

export default function Sidebar({ handleFilter, selectedCategory, selectedPrice, selectedColor }) {
    return (
        <section className='sidebar'>
            <Category handleChange={handleFilter} selected={selectedCategory} />
            <Price handleChange={handleFilter} selected={selectedPrice} />
            <Color handleChange={handleFilter} selected={selectedColor} />
        </section>
    )
}
