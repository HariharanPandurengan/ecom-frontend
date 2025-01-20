import React, { useState, useEffect, useContext } from "react";
import Header from "./Header,Footer/Header";
import "../App.css";
import axios from "axios";
import Footer from "./Header,Footer/Footer";

const initialProductState = { 
  name: '', 
  price: '', 
  sex: '',
  category: '', 
  subCategory: '', 
  material: '', 
  totalQuantity: '', 
  description: '', 
  colors: [] as string[], 
  sizes: {}, 
  images: {}, 
  fits: '',
  sleeves: '',
  occasion: '',
  pattern:  '',
  trendingProd: false,
};

interface Product {
name: string;
price: string;
sex: string;
category: string;
subCategory: string;
material: string;
totalQuantity: string;
description: string;
colors: string[];
sizes: SizesOptions;
images: Image;
fits: string,
sleeves: string,
occasion: string,
pattern:  string,
trendingProd: boolean;
}

const ProductCard = () => {
  const [product, setProduct] = useState<Product>(initialProductState);
  const [selectedSize, setSelectedSize] = useState("xs");
  const [images, setSelectedImage] = useState("src/assets/Pictures/blue shirt.jpg")
  const image = "src/assets/Pictures/blue shirt.jpg";
  const handleSizeChange = (e : any) => {
    setSelectedSize(e.target.value);
  };
  const handleImageChange = (e:any) => {
    setSelectedImage(e.target.value);
  }

  const useEffect = () => {
      const fetchProduct = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProduct`)
            .then(res => {
                if (res.data.status === true) {
                    setProduct(res.data.products);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
  }

  return (
    <div>
        <Header/>
        <div className="flex mt-[60px]" style={{fontFamily:'Montserrat-Thin'}}>
      <div className="flex-none h-[100vh] w-[40rem] relative">
        <img
          src={image}
          alt="Classic Utility Jacket"
          className="absolute inset-0 w-full object-cover p-5"
        ></img>
      </div>
      <form className="flex-auto p-6">
        <div className="flex flex-wrap">
          <h1 className="flex-auto text-2xl font-semibold text-slate-900 text-2xl" style={{fontFamily:'Avenir'}}>
            Classic Utility Jacket
          </h1>
        </div>
        <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
            Sizes Available : 
          </div>
        <div className="flex items-baseline mt-4 pb-6 border-slate-200">
          <div className="space-x-2 flex text-sm">
            {["xs", "s", "m", "l", "xl"].map((size) => (
              <label key={size}>
                <input
                  className="sr-only peer"
                  name="size"
                  type="radio"
                  value={size}
                  checked={selectedSize === size}
                  onChange={handleSizeChange}
                />
                <div
                  className={`w-9 h-9 text-['Montserrat'] border rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white`}
                >
                  {size.toUpperCase()}
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="w-full flex-none text-sm font-medium text-slate-700 mt-0">
            Colors Available : 
          </div>
        <div className="flex items-baseline mt-4 pb-6">
          <div className="space-x-2 flex text-sm">
            {["green", "red", "blue"].map((size) => (
              <label key={size}>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white ${
                    size === "green"
                      ? "bg-green-500"
                      : size === "red"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex space-x-4 mb-6 pb-4 text-sm font-medium">
          <div className="flex-auto flex space-x-4">
            <button
              className="h-10 w-40 px-6 font-semibold rounded-md bg-[#C8A165] text-white"
              type="submit"
            >
              Enquiry
            </button>
            <button
              className="h-10 w-40 px-6 font-semibold rounded-md bg-[#000] text-stone-50 border border-slate-200 text-slate-900"
              type="button"
            >
              Bulk Buy
            </button>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-2xl font-semibold text-slate-900" style={{fontFamily:'Montserrat-Thin'}}>Product Details</h2>
          <ul className="mt-4 space-y-2 text-base text-slate-700">
            <li><strong style={{fontFamily:'Montserrat'}}>Material:</strong> 100% Cotton</li>
            <li><strong style={{fontFamily:'Montserrat'}}>Fit:</strong> Regular Fit</li>
            <li><strong style={{fontFamily:'Montserrat'}}>Sleeve:</strong> Long Sleeve</li>
            <li><strong style={{fontFamily:'Montserrat'}}>Color:</strong> Olive Green</li>
            <li><strong style={{fontFamily:'Montserrat'}}>Description :</strong> Edgy graffiti art meets casual comfort in this urban favorite.</li>
          </ul>
        </div>
        <div className="text-4xl mt-7 font-semibold text-slate-500 text-red-600">
            <i>$110.00</i>
        </div>
      </form>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default ProductCard;
