// App.js
import axios from "axios";
import React, { useState } from "react";
import Header from "./Header,Footer/Header";
import "../App.css";

const initialProductState = { 
  name: '', 
  price: '', 
  category: '', 
  subCategory: '', 
  material: '', 
  totalQuantity: '', 
  description: '', 
  colors: [] as string[], 
  sizes: {}, 
  images: {}, 
  trendingProd: false,
};

interface Product {
name: string;
price: string;
category: string;
subCategory: string;
material: string;
totalQuantity: string;
description: string;
colors: string[];
sizes: SizesOptions;
images: Image;
trendingProd: boolean;
}

const ProductCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Header></Header>
      <div className="showproduct">
        <section className="productimage-container">
          <img className="product-image" src="src\assets\Pictures\yellow shirt.jpg"></img>
        </section>
        <section className="product-texts">
            <h3 className="product-name" style={{fontSize:'32px'}}>Yellow shirt</h3>
            <p className="product-price" style={{fontSize:'20px'}}>599</p>
            <p className="product-description" style={{fontSize:'16px', fontFamily:'Montserrat-Thin'}}>Solid Yellow T-Shirt</p>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
