import React from 'react'
import FilterItem from '../../Components/FilterItem'
import './Category.css'

export default function Category({ handleChange, selected, isMale, isKids, isFemale }) {
    return (
        <div>
            <h2 className='category-title'>Category</h2>
            <div>
                <FilterItem name='category' filter='All' value=''
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Sneakers' value='Sneakers'
                    onChangeHandler={handleChange} selected={selected} />
                <FilterItem name='category' filter='Flats' value='Flats'
                    onChangeHandler={handleChange} selected={selected} />
                {!isFemale && <FilterItem name='category' filter='Sandals' value='Sandals'
                    onChangeHandler={handleChange} selected={selected} />}
                {!isKids && <FilterItem name='category' filter='Boots' value='Boots'
                    onChangeHandler={handleChange} selected={selected} />}
                {!isMale && !isKids && <FilterItem name='category' filter='Heels' value='Heels'
                    onChangeHandler={handleChange} selected={selected} />}
                {!isMale && !isFemale && <FilterItem name='category' filter='Slippers' value='Slippers'
                    onChangeHandler={handleChange} selected={selected} />}
            </div>
        </div>
    )
}
