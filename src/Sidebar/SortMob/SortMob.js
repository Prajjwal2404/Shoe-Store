import React from 'react'
import FilterItem from '../../Components/FilterItem'
import './SortMob.css'

export default function SortMob({ handleChange, selected }) {
    return (
        <div>
            <h2 className='sort-title'>Sort</h2>
            <div>
                <FilterItem name='sort' filter='Relevance' value='relevance'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='sort' filter='Rating High to Low' value='rating'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='sort' filter='Price High to Low' value='priceH'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='sort' filter='Price Low to High' value='priceL'
                    onChangeHandler={handleChange} selected={selected} />
            </div>
        </div>
    )
}
