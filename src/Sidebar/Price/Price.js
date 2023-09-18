import React from 'react'
import FilterItem from '../../Components/FilterItem'
import './Price.css'

export default function Price({ handleChange, selected }) {
    return (
        <div>
            <h2 className='price-title'>Price</h2>
            <div>
                <FilterItem name='price' filter='All' value=''
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='price' filter='$0 - $50' value='50'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='price' filter='$50 - $100' value='100'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='price' filter='$100 - $150' value='150'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='price' filter='Over $150' value='200'
                    onChangeHandler={handleChange} selected={selected} />
            </div>
        </div>
    )
}
