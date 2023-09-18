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
                <FilterItem id='black' name='color' filter='Black' value='black'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='blue' name='color' filter='Blue' value='blue'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='red' name='color' filter='Red' value='red'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem id='white' name='color' filter='White' value='white'
                    onChangeHandler={handleChange} selected={selected} />
            </div>
        </div>
    )
}
