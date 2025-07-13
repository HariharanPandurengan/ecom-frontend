import React, { useState, useEffect, useContext } from "react";
import Header from "./Header,Footer/Header";
import "../App.css";
import axios from "axios";
import Footer from "./Header,Footer/Footer";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from 'lucide-react';

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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>(initialProductState);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [images, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const image = "src/assets/Pictures/blue shirt.jpg";

  const handleSizeChange = (e : any) => {
    setSelectedSize(e.target.value);
  };
  const handleImageChange = (e:any) => {
    setSelectedImage(e.target.value);
  }

  const sendingProdData = (productID : any) => {
    localStorage.setItem('current_product', productID)
            console.log(productID)
        navigate('/ProductCard')
  }
  useEffect(() => {
    if(sessionStorage.getItem("cartId") === null || sessionStorage.getItem("cartId") === "" || sessionStorage.getItem("cartId") === undefined){
            setBagItemCount(false)
        }
        else{
            setBagItemCount(true)
        }
    const fetchProduct = () => {
      axios.post(`${import.meta.env.VITE_REACT_API_URL}getProduct`,{product_id:localStorage.getItem('current_product')})
      .then(res => {
          if (res.data.status === true) {
              setProduct(res.data.product[0]);
              // Set default color and size on load
              const colorList = res.data.product[0].colors;
              if (colorList && colorList.length > 0) {
                setSelectedColor(colorList[0]);
                const sizeList = Object.keys(res.data.product[0].sizes[colorList[0]] || {});
                // const imageList = Object.values(res.data.product[0].images);
                // setSelectedImage(imageList);
                if (sizeList.length > 0) setSelectedSize(sizeList[0]);
              }
            }
      })
      .catch(err => {
          console.log(err)
      })
    }
    fetchProduct()
  }, []);

  // When color changes, update size to first available for that color
  useEffect(() => {
    if (selectedColor && product.sizes && product.sizes[selectedColor]) {
      const sizeList = Object.keys(product.sizes[selectedColor]);
      const imageList = [product.images[selectedColor]];
      setSelectedImage(imageList);
      // If there are sizes available for the selected color, set the first one as default
      if (sizeList.length > 0) setSelectedSize(sizeList[0]);
      else setSelectedSize("");
    }
  }, [selectedColor, product]);

  // Floating cart icon logic (same as Home)
  const [cartIconPos, setCartIconPos] = useState<{ x: number; y: number }>({ x: 1400, y: 5 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragMoved, setDragMoved] = useState(false);
  const [bagItemCount, setBagItemCount] = useState(false);

  useEffect(() => {
        if (product.sizes[selectedColor] && product.sizes[selectedColor][selectedSize]) {
            const availableQuantity = parseInt(product.sizes[selectedColor][selectedSize], 10);
            console.log("Available Quantity:", availableQuantity);
            if(quantity > availableQuantity) {
                console.warn(`Only ${availableQuantity} items available in this size.`);
                alert(`Only ${availableQuantity} items available in this size.`);
                setQuantity(availableQuantity);
            }
        }
  });
  const handleCartMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragMoved(false);
    let clientX = 0, clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setDragOffset({
      x: clientX - cartIconPos.x,
      y: clientY - cartIconPos.y,
    });
    e.stopPropagation();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      let clientX = 0, clientY = 0;
      if ('touches' in e) {
        // @ts-ignore
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        // @ts-ignore
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setCartIconPos({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
      setDragMoved(true);
    };
    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, dragOffset]);

  const handleCartClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragMoved) {
      navigate('/CheckoutPage');
    }
  };

  const increaseQuantity = (count : any) => {
    if (product.sizes[selectedColor] && product.sizes[selectedColor][selectedSize]) {
      const availableQuantity = parseInt(product.sizes[selectedColor][selectedSize], 10);
      console.log("Available Quantity:", availableQuantity);
      if (count > availableQuantity) {
        console.warn(`Only ${availableQuantity} items available in this size.`);
        alert(`Only ${availableQuantity} items available in this size.`);
        return;
      }
      else{
        setQuantity(count);
      }
    } else {
      alert("Please select a valid size.");
      setQuantity(1);
    }
  };

  console.log(product)

  return (
    <div>
      <style>
        {`
        .floating-cart-icon {
            position: fixed;
            z-index: 100;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: box-shadow 0.2s;
            cursor: grab;
            user-select: none;
        }
        .floating-cart-icon:active {
            cursor: grabbing;
        }
        .floating-cart-icon:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            background: #f5e9dd;
        }
        .cart-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #C8A165;
            color: #fff;
            border-radius: 9999px;
            font-size: 0.85rem;
            padding: 2px 8px;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .floating-cart-icon {
                width: 44px;
                height: 44px;
            }
            .cart-badge {
                top: 2px;
                right: 2px;
                font-size: 0.7rem;
                padding: 1px 6px;
            }
        }
        `}
      </style>
      {/* Floating Cart Icon */}
      <div
        className="floating-cart-icon"
        style={{
          left: cartIconPos.x,
          top: cartIconPos.y,
          position: "fixed",
        }}
        onMouseDown={handleCartMouseDown}
        onTouchStart={handleCartMouseDown}
        onClick={handleCartClick}
      >
      <div className="relative">
        <ShoppingBag size={28} color="#000" />
        
        {/* Red dot indicator */}
        {bagItemCount === false && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
        )}

        {/* Optional: show count badge */}
        {bagItemCount && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-600 rounded-full border-2 border-white" />
        )}
      </div>
      </div>
      <Header />
      <div
        className="flex flex-col sm:flex-row mt-[60px] p-4 sm:p-6"
        style={{ fontFamily: "Montserrat-Thin" }}
      >
        {/* Image Section */}
        <div className="flex-none h-[60vh] sm:h-[100vh] w-full sm:w-[40rem] relative">
          <img
            src={`${images}`}
            alt={`${images}`}
            className="absolute inset-0 w-full h-full object-cover p-5"
          />
        </div>

        {/* Product Details Form */}
        <form className="flex-auto p-6">
          <div className="flex flex-wrap">
            <h1
              className="flex-auto text-2xl sm:text-3xl font-semibold text-slate-900"
              style={{ fontFamily: "Avenir" }}
            >
              {product.name}
            </h1>
          </div>

          {/* Colors */}
          <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
            Colors Available:
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pb-6">
            {product.colors.map((color) => (
              <label key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-2 ${
                    selectedColor === color ? "border-[#fff]" : "border-transparent"
                  } ${
                    color === "Green"
                      ? "bg-green-500"
                      : color === "Red"
                      ? "bg-red-500"
                      : color === "Pink"
                      ? "bg-pink-500"
                      : color === "Blue"
                      ? "bg-blue-500"
                      : color === "White"
                      ? "bg-gray-100"
                      : color === "Yellow"
                      ? "bg-yellow-500"
                      : color === "Orange"
                      ? "bg-orange-500"
                      : color === "Purple"
                      ? "bg-purple-500"
                      : color === "Brown"
                      ? "bg-amber-700"
                      : color === "Grey"
                      ? "bg-gray-500"
                      : color === "Navy"
                      ? "bg-blue-900"
                      : color === "Teal"
                      ? "bg-teal-500"
                      : color === "Maroon"
                      ? "bg-red-900"
                      : "bg-black"
                  }`}
                  style={{ outline: selectedColor === color ? "2px solid #C8A165" : "none" }}
                ></div>
              </label>
            ))}
          </div>

          {/* Sizes */}
          <div className="w-full flex items-center gap-2 text-sm font-medium text-slate-700 mt-0">
            Sizes Available:
            <a style={{ fontSize: "0.8rem", color: "blue", cursor: "pointer" }}
              onClick={() => setShowSizeChart(true)}
            >
              Size Chart
            </a>
          </div>


          <div className="flex flex-wrap gap-2 mt-4 pb-6">
            {selectedColor &&
              product.sizes &&
              product.sizes[selectedColor] &&
              Object.keys(product.sizes[selectedColor]).map((size) => (
                <label key={size}>
                  <input
                    className="sr-only peer"
                    name="size"
                    type="radio"
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size)}
                  />
                  <div
                    className={`w-9 h-9 border rounded-lg flex items-center justify-center text-slate-700 cursor-pointer
                  ${selectedSize === size ? "font-semibold bg-slate-900 text-white" : ""}
                  ${Number(product.sizes[selectedColor][size]) === 0 ? "opacity-40 cursor-not-allowed" : ""}
                `}
                    style={{
                      pointerEvents: Number(product.sizes[selectedColor][size]) === 0 ? "none" : "auto"
                    }}
                  >
                    {size.toUpperCase()}
                  </div>
                </label>
              ))}
          </div>

          {/* Quantity */}
          <div className="w-full flex-none text-sm text-slate-700 mt-0 mb-2" style={{ fontFamily: "Montserrat-Thin" }}>
            Quantity:
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <button
                type="button"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#C8A165] text-white font-bold text-lg"
                style={{ fontFamily: "Montserrat" }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>
              <span className="mx-3 text-lg font-normal" style={{ fontFamily: "Montserrat" }}>{quantity}</span>
              <button
                type="button"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#C8A165] text-white font-bold text-lg"
                style={{ fontFamily: "Montserrat" }}
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 text-sm font-medium">
            <style>
              {`
                .custom-btn {
                  background-color: #000;
                  color: #fff;
                  transition: background 0.2s, color 0.2s;
                }
                .custom-btn.add-to-cart:hover {
                  background-color: #fff !important;
                  color: #000 !important;
                  border: 2px solid #000 !important;
                }
                .custom-btn.buy-now:hover {
                  background-color: #fff !important;
                  color: #000 !important;
                  border: 2px solid #000 !important;
                }
              `}
            </style>
            <button
              className="custom-btn add-to-cart h-10 w-full sm:w-40 px-6 font-semibold rounded-md border border-slate-200"
              type="button"
              onClick={async () => {
                const userId = sessionStorage.getItem("userId");
                if (!userId) {
                  navigate("/CustomerLogin");
                  return;
                }
                if (!product._id || !selectedColor || !selectedSize || quantity <= 0) {
                  alert("Please select color and size.");
                  return;
                }
                try {
                  await axios.post(
                    `${import.meta.env.VITE_REACT_API_URL}addCart`,
                    {
                      userId: userId.toString(),
                      productId: product._id.toString(),
                      productColor: selectedColor.toString(),
                      productSize: selectedSize.toString(),
                      quantity: Number(quantity),
                    }
                  );
                  alert("Added to cart!");
                  sessionStorage.setItem("cartId", localStorage.getItem("current_product") || "");
                  setBagItemCount(true);
                } catch (err) {
                  alert("Failed to add to cart.");
                }
              }}
            >
              Add to Cart
            </button>
            <button
              className="custom-btn buy-now h-10 w-full sm:w-40 px-6 font-semibold rounded-md border border-slate-200"
              type="button"
              onClick={async () => {
                const userId = sessionStorage.getItem("userId");
                if (!userId) {
                  navigate("/CustomerLogin");
                  return;
                }
                if (!product._id || !selectedColor || !selectedSize || quantity <= 0) {
                  alert("Please select color and size.");
                  return;
                }
                try {
                  await axios.post(
                    `${import.meta.env.VITE_REACT_API_URL}addCart`,
                    {
                      userId: userId.toString(),
                      productId: product._id.toString(),
                      productColor: selectedColor.toString(),
                      productSize: selectedSize.toString(),
                      quantity: Number(quantity),
                    }
                  );
                  navigate("/CheckoutPage");
                  setBagItemCount(false); 
                } catch (err) {
                  alert("Failed to add to cart.");
                }
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h2 className="text-2xl font-semibold text-slate-900" style={{fontFamily:'Montserrat-Thin'}}>
              Product Details
            </h2>
            <ul className="mt-4 space-y-2 text-base text-slate-700">
              <li>
                <strong style={{fontFamily:'Montserrat-Thin'}}>Material:</strong> {product.material}
              </li>
              <li>
                <strong style={{fontFamily:'Montserrat-Thin'}}>Fit:</strong> {product.fits}
              </li>
              <li>
                <strong style={{fontFamily:'Montserrat-Thin'}}>Sleeve:</strong> {product.sleeves}
              </li>
              <li>
                <strong style={{fontFamily:'Montserrat-Thin'}}>Color:</strong> {product.colors.join(", ")}
              </li>
              <li>
                <strong style={{fontFamily:'Montserrat-Thin'}}>Description:</strong> {product.description}
              </li>
            </ul>
          </div>

          {/* Price */}
          <div className="text-3xl sm:text-4xl mt-7 font-semibold text-red-600">
            <i>₹ {product.price}</i>
          </div>
        </form>
      </div>
      {showSizeChart && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-[999] flex items-center justify-center size-chart">
    <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md relative">
      <div
        onClick={() => setShowSizeChart(false)}
        className="absolute text-xl font-bold text-gray-500 hover:text-black">   
        &times;
      </div>
      <h3 className="text-lg font-semibold mb-4 text-center">Size Chart</h3>

      {/* Example chart — replace with actual image or table */}
      {/* <img
        src="/assets/size-chart-example.png" // ✅ replace with your real image path
        alt="Size Chart"
        className="w-full h-auto rounded"
      /> */}

      OR — use a table instead of image:
      <table className="w-full text-sm text-left border border-gray-300 text-gray-800">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th className="border px-3 py-2">Size</th>
            <th className="border px-3 py-2 text-green-600">Neck (in)</th>
            <th className="border px-3 py-2 text-blue-600">Max Waist (in)</th>
            <th className="border px-3 py-2 text-red-600">Chest (in)</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr><td className="border px-3 py-1">S</td><td className="border">14"-14.5"</td><td className="border">36"</td><td className="border">34.5"-38"</td></tr>
          <tr><td className="border px-3 py-1">M</td><td className="border">15"-15.5"</td><td className="border">40"</td><td className="border">38.5"-42"</td></tr>
          <tr><td className="border px-3 py-1">L</td><td className="border">16"-16.5"</td><td className="border">42"</td><td className="border">42.5"-46"</td></tr>
          <tr><td className="border px-3 py-1">XL</td><td className="border">17"-17.5"</td><td className="border">48"</td><td className="border">46.5"-50"</td></tr>
          <tr><td className="border px-3 py-1">2X</td><td className="border">18"-18.5"</td><td className="border">51.5"</td><td className="border">50.5"-53"</td></tr>
          <tr><td className="border px-3 py-1">3X</td><td className="border">19"-19.5"</td><td className="border">56"</td><td className="border">53.5"-55"</td></tr>
          {/* <tr><td className="border px-3 py-1">4X</td><td className="border">20"-20.5"</td><td className="border">58.5"</td><td className="border">55.5"-56.5"</td></tr>
          <tr><td className="border px-3 py-1">5X</td><td className="border">21"-21.5"</td><td className="border">62"</td><td className="border">56.5"-59"</td></tr>
          <tr><td className="border px-3 py-1">6X</td><td className="border">22"-22.5"</td><td className="border">65.5"</td><td className="border">62.5"-65"</td></tr> */}
        </tbody>
      </table>

     
    </div>
  </div>
)}
      <Footer />
    </div>
  );
};

export default ProductCard;
