import React, { useRef, useState } from 'react'
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import Products from '../Products/Products';
import HandleMedia from '../Functions/HandleMedia'

export default function Listings({ data, isWishlist, removeWishlist, isMale, isFemale, isKids }) {

  const isMobile = HandleMedia('800px')

  const ref = useRef([])

  const [selectedFilter, setSelectedFilter] = useState({
    category: '',
    price: '',
    color: '',
    brand: '',
    sort: 'relevance'
  });

  function handleFilter(event) {
    const { name, value } = event.target;
    setSelectedFilter(prevSelectedFilter => (name === 'brand' || name === 'sort') ?
      { ...prevSelectedFilter, [name]: value } : { ...prevSelectedFilter, [name]: value, brand: '' }
    )
  }

  var brandShown;

  function filterData(products, selectedCategory, selectedPrice, selectedColor, selectedBrand, selectedSort) {

    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(({ category }) => category === selectedCategory);
    }

    if (selectedPrice) {
      filteredProducts = filteredProducts.filter(({ newPrice }) => newPrice.toString() === selectedPrice);
    }

    if (selectedColor) {
      filteredProducts = filteredProducts.filter(({ color }) => color === selectedColor);
    }

    brandShown = filteredProducts;

    if (selectedBrand) {
      filteredProducts = filteredProducts.filter(({ company }) => company === selectedBrand);
    }

    if (selectedSort === 'relevance') {
      filteredProducts = filteredProducts.sort((a, b) => a.Sno - b.Sno);
    }

    else if (selectedSort === 'rating') {
      filteredProducts = filteredProducts.sort((a, b) => b.star - a.star);
    }

    else if (selectedSort === 'priceH') {
      filteredProducts = filteredProducts.sort((a, b) => b.newPrice - a.newPrice);
    }

    else if (selectedSort === 'priceL') {
      filteredProducts = filteredProducts.sort((a, b) => a.newPrice - b.newPrice);
    }

    return filteredProducts;
  }

  const result = filterData(data, selectedFilter.category, selectedFilter.price, selectedFilter.color, selectedFilter.brand, selectedFilter.sort);

  return (
    <>
      <Sidebar handleFilter={handleFilter} selectedCategory={selectedFilter.category}
        selectedPrice={selectedFilter.price} selectedColor={selectedFilter.color} selectedSort={selectedFilter.sort}
        myref={ref} isMale={isMale} isFemale={isFemale} isKids={isKids} isMobile={isMobile} />
      <Topbar handleFilter={handleFilter} brandShown={brandShown} selectedBrand={selectedFilter.brand}
        selectedSort={selectedFilter.sort} myref={ref} isMobile={isMobile} />
      <Products isWishlist={isWishlist} products={result} removeWishlist={removeWishlist} />
    </>
  );
}