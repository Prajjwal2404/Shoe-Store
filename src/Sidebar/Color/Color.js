import React from 'react'
import FilterItem from '../../Components/FilterItem'
import './Color.css'

export default function Color({ handleChange, selected }) {
    return (
        <div>
            <h2 className='color-title'>Color</h2>
            <div>
                <FilterItem id='all' name='color' filter='All' value=''
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='black' name='color' filter='Black' value='Black'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='blue' name='color' filter='Blue' value='Blue'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='red' name='color' filter='Red' value='Red'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='white' name='color' filter='White' value='White'
                    onChangeHandler={handleChange} selected={selected} />
            </div>
        </div>
    )
}
