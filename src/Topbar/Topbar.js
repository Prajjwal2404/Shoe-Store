import React from 'react'
import Brands from './Brands/Brands'
import Sort from './Sort/Sort'
import './Topbar.css'

export default function Topbar(props) {
    return (
        <div className='topbar'>
            <Brands handleBrand={props.handleFilter} brandShown={props.brandShown} selected={props.selectedBrand} />
            <Sort handleSort={props.handleFilter} selected={props.selectedSort} />
        </div>
    )
}
