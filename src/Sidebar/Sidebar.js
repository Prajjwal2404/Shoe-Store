import React, { useEffect } from 'react'
import Category from './Category/Category'
import Price from './Price/Price'
import Color from './Color/Color'
import SortMob from './SortMob/SortMob'
import { IoMdClose } from 'react-icons/io'
import './Sidebar.css'

export default function Sidebar({ handleFilter, selectedCategory, selectedPrice, selectedColor, selectedSort, myref,
    isMale, isFemale, isKids, isMobile }) {

    useEffect(() => {
        function checkSidebar(event) {
            if (!myref.current[0].contains(event.target) && !myref.current[1].contains(event.target) && myref.current[0].classList.contains('show')) {
                sidebarClose()
            }
        }
        if (isMobile) window.addEventListener('click', checkSidebar)
        return () => window.removeEventListener('click', checkSidebar)
    }, [isMobile])

    function sidebarClose() {
        myref.current[0].classList.remove('show')
    }

    return (
        <section className='sidebar' ref={el => myref.current[0] = el}>
            {isMobile && <IoMdClose className='sidebar-close' onClick={sidebarClose} />}
            <Category handleChange={handleFilter} selected={selectedCategory} isMale={isMale} isFemale={isFemale}
                isKids={isKids} />
            <Price handleChange={handleFilter} selected={selectedPrice} />
            <Color handleChange={handleFilter} selected={selectedColor} />
            {isMobile && <SortMob handleChange={handleFilter} selected={selectedSort} />}
        </section>
    )
}
