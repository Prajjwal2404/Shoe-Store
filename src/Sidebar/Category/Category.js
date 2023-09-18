import React from 'react'
import FilterItem from '../../Components/FilterItem'
import './Category.css'

export default function Category({ handleChange, selected }) {
    return (
        <div>
            <h2 className='category-title'>Category</h2>
            <div>
                <FilterItem name='category' filter='All' value=''
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Sneakers' value='sneakers'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Flats' value='flats'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Sandals' value='sandals'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Heels' value='heels'
                    onChangeHandler={handleChange} selected={selected} />
            </div>
        </div>
    )
}
