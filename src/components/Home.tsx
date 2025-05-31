import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User, Heart, ShoppingBag } from 'lucide-react';
import Header from "./Header,Footer/Header";
import ProductCard from "./ProductCard";
import { redirect, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Header,Footer/Footer";
import TrendingSectionImage from "../assets/Pictures/blueShirt.jpg"
import ShirtsSectionImage from "../assets/Pictures/pink shirt.jpg"
import TShirtSectionImage from "../assets/Pictures/yellow shirt.jpg"
import PantsSectionImage from "../assets/Pictures/purple shirt.jpg"

interface SizesOptions { 
    [key: string]: { [key: string]: string }; 
}

interface Image { 
    [key: string]:  string ; 
}


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

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentFilters, setCurrentFilters] = useState<Record<string, Record<string, boolean>>>({});
    const [isSticky, setIsSticky] = useState(false)
    const [bagItemCount, setBagItemCount] = useState(0)
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filterMet = [
        {
            title: 'sex',
            list : ['Male',
                'Female',
                'Unisex']
        },
        {
            title: 'category',
            list: ['Shirts',
                'T-Shirts',
                'Pants',
                'Trousers']
        },
        {
            title: 'material',
            list: [ 'Cotton',
                'Cotton Blend',
                'Rayon',
                'Polyester',
                'Poly Blend',
                'Linen',
                'Rayon Blend',
                'Lyocell Blend',
                'Viscose Blend',
                'Viscose',
                'Nylon Blend',
                'Acrylic Blend']
        },
        {
            title: 'sizes',
            list: ["S", "M", "L", "XL", "XXL"]
        },
        {
            title : 'fits',
            list : ['Baggy Fit',
                'Boot cut',
                'Box Fit',
                'Comfort Fit',
                'Loose Fit',
                'Oversized Fit',
                'Regular Fit',
                'Relaxed Fit',
                'Skinny Fit',
                'Slim Fit']
        },
        {
            title: 'price',
            list: ['0-500', '501-1000', '1001-2000', '2001-3000', '3000<']
        },
        {
            title: 'colors',
            list: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"]
        },
        {
            title : 'sleeves',
            list : ['Elbow Sleeve',
                'Full Sleeve',
                'Half Sleeve']
        },
        {
            title : 'occasion',
            list : ["Casual Wear",
                    "Formal Wear",
                    "Festive Wear",
                    "College Wear",
                    "Street Wear"]
        },
        {
            title : 'pattern',
            list : ["Checks",
                    "Graphic Print",
                    "Colourblocked",
                    "Plain",
                    "Printed",
                    "Self-Design",
                    "Stripes",
                    "Geometric",
                    "Abstract",
                    "Textured",
                    "Marble",
                    "Distressed",
                    "Floral"]
        },
    ]
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sections = [
        { title: "Trendings", imgSrc: TrendingSectionImage, alt: "Trendings" },
        { title: "Shirts", imgSrc: ShirtsSectionImage, alt: "Shirts" },
        { title: "T-Shirts", imgSrc: TShirtSectionImage, alt: "T-Shirts" },
        { title: "Pants", imgSrc: PantsSectionImage, alt: "Pants" },
      ];
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        dots: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    // Custom Arrow Components
    function SampleNextArrow(props: any) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    zIndex: 30,
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
                onClick={onClick}
            >
                <span style={{ fontSize: "1.5rem", color: "#7B3F14", fontWeight: 700 }}>{'>'}</span>
            </div>
        );
    }

    function SamplePrevArrow(props: any) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    zIndex: 30,
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    background: "#fff",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
                onClick={onClick}
            >
                <span style={{ fontSize: "1.5rem", color: "#7B3F14", fontWeight: 700 }}>{'<'}</span>
            </div>
        );
    }

    useEffect(() => {
        fetchProducts()
        const initialState: Record<string, Record<string, boolean>> = {}
        for (let i = 0; i < filterMet.length; i++) {
            const title = filterMet[i]['title'];
            initialState[title] = {};
            for (let j = 0; j < filterMet[i]['list'].length; j++) {
                const listItem = filterMet[i]['list'][j];
                initialState[title][listItem] = false;
            }
        }
        setCurrentFilters(initialState)
        setBagItemCount(3)
    }, [])

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
            .then(res => {
                if (res.data.status === true) {
                    setProducts(res.data.products);
                    setFilteredProducts(res.data.products)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Generate counts for the filters
    const fetchCount = (title: string, subCat: string) => {
        if (title == 'material' || title == 'sex' || title == 'fits' || title == 'sleeves' || title == 'occasion' || title == 'pattern') {
            const filtered = products.filter(items => {
                return items[title].toLowerCase() == subCat.toLowerCase();
            })
            return filtered.length
        }
        else if (title == 'category') {
            const filtered = products.filter(items => {
                // Normalize for plural/singular and case-insensitive
                return (
                    items.category &&
                    (
                        items.category.toLowerCase() === subCat.toLowerCase() ||
                        items.category.toLowerCase().replace(/s$/, '') === subCat.toLowerCase().replace(/s$/, '')
                    )
                );
            });
            return filtered.length;
        }
        else if (title == 'price') {
            let priceLimit: any = [];
            if (subCat.includes('-')) {
                priceLimit = subCat.split('-')
                const filtered = products.filter(items => {
                    return (Number(items[title]) >= Number(priceLimit[0])) && (Number(items[title]) <= Number(priceLimit[1]))
                })
                return filtered.length
            }
            else {
                const filtered = products.filter(items => {
                    return Number(items[title]) > Number(subCat.slice(0, -1))
                })
                return filtered.length
            }
        }
        else if (title == 'sizes') {
            let count = 0;
            products.filter(items => {
                for (const key in items['sizes']) {
                    for (const key2 in items['sizes'][key]) {
                        if (key2 === subCat) {
                            count = count + Number(items['sizes'][key][key2])
                        }
                    }
                }
            })
            return count
        }
        else if (title == 'colors') {
            let count = 0;
            products.filter(items => {
                for (const key in items['sizes']) {
                    if (key === subCat) {
                        for (const key2 in items['sizes'][key]) {
                            count = count + Number(items['sizes'][key][key2])
                        }
                    }
                }
            })
            return count
        }
    }

    const ChangeCurrentFilters = (e: any, title: string, subCat: string) => {
        e.preventDefault();
        setCurrentFilters(prevData => ({
            ...prevData,
            [title]: {
                ...Object.keys(prevData[title]).reduce((acc, key) => {
                    acc[key] = key === subCat ? !prevData[title][key] : false;
                    return acc;
                }, {}),
            }
        }))
    }


    const sendingProdData = (productID : any) => {
        localStorage.setItem('current_product', productID);
        navigate('/ProductCard');
    }
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollPosition = window.scrollY;
        if(currentScrollPosition > 1100)
        {
            setIsSticky(true)
        }
        else{
            setIsSticky(false)
        }
        setScrollPosition(currentScrollPosition);
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }); 

    useEffect(() => {
        let filteredOne = [];
        let AllFalse = true;
        let material = false;
        let price = false;
        let colors = false;
        let sizes = false;
        let sex = false;
        let sexType = ''
        let fits = false;
        let sleeves = false;
        let occasion = false;
        // let pattern = false;
        let whichColor = '';

        for (let key in currentFilters) {
            for (let key2 in currentFilters[key]) {
                if (currentFilters[key][key2] === true && AllFalse === true) {
                    AllFalse = false
                }
                if (currentFilters[key][key2] === true) {
                    if (key === 'material') {
                        material = true;
                    }
                    if (key === 'price') {
                        price = true;
                    }
                    if (key === 'sizes') {
                        sizes = true;
                    }
                    if (key === 'colors') {
                        colors = true;
                        whichColor = key2
                    }
                    if (key === 'sex') {
                        sex = true;
                        sexType = key2
                    }
                    if (key === 'fits') {
                        fits = true;
                    }
                    if (key === 'sleeves') {
                        sleeves = true;
                    }
                    if (key === 'occasion') {
                        occasion = true;
                    }
                    // if (key === 'pattern') {
                    //     pattern = true;
                    // }
                }
            }
        }

        let arr = [];

        // Category filter logic
        if (selectedCategory && selectedCategory !== "Trendings") {
            arr = products.filter(list =>
                list.category &&
                (
                    list.category.toLowerCase() === selectedCategory.toLowerCase() ||
                    // handle plural/singular and case-insensitive
                    list.category.toLowerCase().replace(/s$/, '') === selectedCategory.toLowerCase().replace(/s$/, '')
                )
            );
            filteredOne = arr;
        } else if (sex) {
            arr = products.filter(list => list.sex.toLowerCase().trim() == sexType.toLowerCase().trim())
            filteredOne = arr
        }
        else{
            arr = products
        }
        if (AllFalse && !selectedCategory) {
            setFilteredProducts(products)
        } 
        else if (AllFalse && selectedCategory) {
            setFilteredProducts(arr)
        } 
        else {
            for (let key in currentFilters) {
                for (let key2 in currentFilters[key]) {
                    if (currentFilters[key][key2] === true) {
                        // if(key === 'sex'){
                        //     for (let i = 0; i < arr.length; i++) {
                        //         if (arr[i]['sex'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                        //             filteredOne.push(arr[i])
                        //         }
                        //     }
                        // }
                        if (key === 'material') {
                            if(sex || selectedCategory){
                                for (let i = 0; i < filteredOne.length; i++) {
                                    if (filteredOne[i]['material'].toLocaleLowerCase().trim() !== key2.toLocaleLowerCase().trim()) {
                                        filteredOne.slice(i, 1);
                                        filteredOne = filteredOne.filter((_, ii) => ii !== i);
                                    }
                                }
                            }
                            else{
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i]['material'].toLocaleLowerCase().trim() === key2.toLocaleLowerCase().trim()) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                        else if (key === 'price') {
                            let priceLimit: any = [];
                            if (key2.includes('-')) {
                                priceLimit = key2.split('-')
                                if (!material && !sex) {
                                    for (let i = 0; i < arr.length; i++) {
                                        if (Number(arr[i]['price']) >= Number(priceLimit[0]) && Number(arr[i]['price']) <= Number(priceLimit[1])) {
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === arr[i]['_id']
                                            })
                                            if (alreadyExist.length === 0) {
                                                filteredOne.push(arr[i])
                                            }
                                        }
                                    }
                                }
                                else if (material || sex) {
                                    for (let i = 0; i < filteredOne.length; i++) {
                                        if (!(Number((filteredOne[i]['price']) >= Number(priceLimit[0])) && Number(arr[i]['price']) <= Number(priceLimit[1]))) {
                                            filteredOne.splice(i, 1);
                                        }
                                    }
                                }
                            }
                            else {
                                if (!material && !sex) {
                                    for (let i = 0; i < arr.length; i++) {
                                        if (Number(arr[i]['price']) > Number(key2.slice(0, -1))) {
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === arr[i]['_id']
                                            })
                                            if (alreadyExist.length === 0) {
                                                filteredOne.push(arr[i])
                                            }
                                        }
                                    }
                                }
                                else if (material || sex) {
                                    for (let i = 0; i < filteredOne.length; i++) {
                                        if ((Number(arr[i]['price']) > Number(key2.slice(0, -1))) === false) {
                                            filteredOne.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                        else if (key === 'colors') {
                            if (material || price || sex) {
                                for (let i = 0; i < filteredOne.length; i++) {
                                    let thisColorsTotalCount = 0;
                                    const Colorkeys = Object.keys(filteredOne[i]['sizes']);
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentColorsArray = Object.values(filteredOne[i]['sizes'][Colorkeys[j]]);
                                        if (key2.toLocaleLowerCase() === Colorkeys[j].toLocaleLowerCase()) {
                                            for (let cc = 0; cc < currentColorsArray.length; cc++) {
                                                thisColorsTotalCount += Number(currentColorsArray[cc]);
                                            }
                                        }
                                    }

                                    if (thisColorsTotalCount === 0) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else {
                                for (let i = 0; i < arr.length; i++) {
                                    const Colorkeys = Object.keys(arr[i]['sizes']);
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentColorsArray = Object.values(arr[i]['sizes'][Colorkeys[j]]);
                                        if (key2.toLocaleLowerCase() === Colorkeys[j].toLocaleLowerCase()) {
                                            for (let cc = 0; cc < currentColorsArray.length; cc++) {
                                                const total = currentColorsArray.reduce((sum, num) => sum + Number(num), 0);
                                                if (total !== 0) {
                                                    filteredOne.push(arr[i])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (key === 'sizes') {
                            if (colors || price || material || sex) {
                                for (let i = 0; i < filteredOne.length; i++) {
                                    let thisSizeTotalCount = 0;
                                    const Colorkeys = Object.keys(filteredOne[i]['sizes']);
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        if (!colors) {
                                            const currentSizesArray = Object.keys(filteredOne[i]['sizes'][Colorkeys[j]]);
                                            const currentSizesValueArray = Object.values(filteredOne[i]['sizes'][Colorkeys[j]]);
                                            for (let cc = 0; cc < currentSizesArray.length; cc++) {
                                                if (key2.toLocaleLowerCase() === currentSizesArray[cc].toLocaleLowerCase()) {
                                                    thisSizeTotalCount += currentSizesValueArray[cc]
                                                }
                                            }
                                        }
                                        else {
                                            if (whichColor === Colorkeys[j]) {
                                                const currentSizesArray = Object.keys(filteredOne[i]['sizes'][Colorkeys[j]]);
                                                const currentSizesValueArray = Object.values(filteredOne[i]['sizes'][Colorkeys[j]]);
                                                for (let cc = 0; cc < currentSizesArray.length; cc++) {
                                                    if (key2.toLocaleLowerCase() === currentSizesArray[cc].toLocaleLowerCase()) {
                                                        thisSizeTotalCount += currentSizesValueArray[cc]
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (thisSizeTotalCount === 0) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else {
                                for (let i = 0; i < arr.length; i++) {
                                    let thisSizeTotalCount = 0;
                                    const Colorkeys = arr[i]['sizes'] ? Object.keys(arr[i]['sizes']) : []
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentSizesArray = Object.keys(arr[i]['sizes'][Colorkeys[j]]);
                                        const currentSizesValueArray = Object.values(arr[i]['sizes'][Colorkeys[j]]);
                                        for (let cc = 0; cc < currentSizesArray.length; cc++) {
                                            if (key2.toLocaleLowerCase() === currentSizesArray[cc].toLocaleLowerCase()) {
                                                thisSizeTotalCount += parseInt(currentSizesValueArray[cc])
                                            }
                                        }
                                    }
                                    if (thisSizeTotalCount !== 0) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                        else if(key === 'fits'){
                            if(material || price || colors || sizes || sex){
                                for (let i = 0; i < filteredOne.length; i++) {
                                    if (filteredOne[i]['fits'].toLocaleLowerCase() !== key2.toLocaleLowerCase()) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else{
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i]['fits'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                        else if(key === 'sleeves'){
                            if(material || price || colors || sizes || fits || sex){
                                for (let i = 0; i < filteredOne.length; i++) {
                                    if (filteredOne[i]['sleeves'].toLocaleLowerCase() !== key2.toLocaleLowerCase()) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else{
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i]['sleeves'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                        else if(key === 'occasion'){
                            if(material || price || colors || sizes || sleeves || sex || fits){
                                for (let i = 0; i < filteredOne.length; i++) {
                                    if (filteredOne[i]['occasion'].toLocaleLowerCase() !== key2.toLocaleLowerCase()) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else{
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i]['occasion'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                        else if(key === 'pattern'){
                            if(material || price || colors || sizes || occasion || sex || sleeves || fits){
                                for (let i = 0; i < filteredOne.length; i++) {
                                    if (filteredOne[i]['pattern'].toLocaleLowerCase() !== key2.toLocaleLowerCase()) {
                                        filteredOne.splice(i, 1);
                                    }
                                }
                            }
                            else{
                                for (let i = 0; i < arr.length; i++) {
                                    if (arr[i]['pattern'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                                        filteredOne.push(arr[i])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            setFilteredProducts(filteredOne)
        }
    }, [currentFilters, selectedCategory, products])
    
    // Add this function for category filtering
    const handleSectionCategoryClick = (category: string) => {
        setSelectedCategory(category);
        // Also reset all other filters when a category is selected
        setCurrentFilters(prev => {
            const reset = { ...prev };
            Object.keys(reset).forEach(key => {
                Object.keys(reset[key]).forEach(k2 => {
                    reset[key][k2] = false;
                });
            });
            return reset;
        });
    };

    return (
<div className="min-h-screen flex flex-col">
    <style>
        {`
        @media (max-width: 768px) {
            .landing-dashboard {
                flex-direction: column !important;
            }
            .filter-column {
                position: static !important;
                top: unset !important;
                height: auto !important;
                max-height: none !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-bottom: 1rem;
            }
            .grid-container {
                grid-template-columns: 1fr 1fr !important;
                height: auto !important;
                min-height: 60vh;
            }
            .product-card {
                min-width: 0 !important;
                width: 100% !important;
                margin: 0 !important;
            }
            .product-image-div img {
                height: 180px !important;
                min-height: 180px !important;
                max-height: 180px !important;
            }
            .sections-container {
                gap: 16px !important;
            }
            .div-section {
                width: 120px !important;
                height: 120px !important;
            }
            .carousel-container {
                max-width: 100vw !important;
                max-height: 220px !important;
            }
            .carousel-slide img {
                max-height: 220px !important;
                object-fit: cover !important;
            }
            .gender-button {
                gap: 20px !important;
                height: 50px !important;
            }
            .men-button, .women-button {
                width: 100px !important;
                height: 40px !important;
                font-size: 14px !important;
            }
        }
        @media (max-width: 480px) {
            .sections-container {
                gap: 8px !important;
            }
            .div-section {
                width: 90px !important;
                height: 90px !important;
            }
            .product-image-div img {
                height: 120px !important;
                min-height: 120px !important;
                max-height: 120px !important;
            }
            .grid-container {
                grid-template-columns: 1fr !important;
            }
        }
        `}
    </style>
    <div>
        <Header />
    </div>
    <div className="h-clothingpage mt-[60px] max-w-fit items-center flex-grow">
        <section>
            <div className="carousel-container relative w-full max-h-[700px] max-w-[800px] m-auto overflow-hidden">
                <Slider {...settings}>
                    {products.length !== 0 ? (
                        products.map((trendprod, index) =>
                            trendprod.trendingProd ? (
                                <div key={index} className="carousel-slides flex relative">
                                    <div className="carousel-slide min-w-full text-center relative">
                                        {/* Overlay for product info */}
                                        <div
                                            className="absolute top-0 right-0 w-auto h-auto flex flex-col items-end justify-start z-10 p-6"
                                            style={{
                                                background: "none",
                                                color: "#fff",
                                                pointerEvents: "none"
                                            }}
                                        >
                                            <div
                                                className="mb-1 text-2xl font-bold drop-shadow"
                                                style={{
                                                    fontFamily: "Montserrat",
                                                    pointerEvents: "auto"
                                                }}
                                            >
                                                {trendprod.name}
                                            </div>
                                            <div
                                                className="mb-2 text-lg font-semibold drop-shadow"
                                                style={{
                                                    fontFamily: "Montserrat-Thin",
                                                    pointerEvents: "auto"
                                                }}
                                            >
                                                ₹{trendprod.price}
                                            </div>
                                            <button
                                                className="px-4 py-1 rounded bg-[#7B3F14] text-white font-bold text-base transition-colors"
                                                style={{
                                                    opacity: 0.5,
                                                    pointerEvents: "auto",
                                                    cursor: "pointer",
                                                    fontFamily: "Montserrat"
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    sendingProdData(trendprod._id);
                                                }}
                                                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#000")}
                                                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#7B3F14")}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                        {/* Graded out image */}
                                        <img
                                            className="block w-full"
                                            loading="lazy"
                                            height="100%"
                                            width="100%"
                                            src={`${Object.values(trendprod.images)[0]}`}
                                            alt="promotion"
                                            style={{
                                                filter: "brightness(0.7) grayscale(0.2)"
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : null
                        )
                    ) : (
                        <div>
                            <p className="text-center">--- No products to show ---</p>
                        </div>
                    )}
                </Slider>
            </div>
        </section>
        <section>
            <div className="shop-by-section m-0 p-0 text-center">
                <h1 className="text-lg md:text-xl lg:text-2xl">SHOP BY SECTION</h1>
                <div className="sections-container flex justify-center flex-wrap gap-[30px] md:gap-[60px] p-[10px] md:p-[20px]">
                    {sections.map((section, index) => (
                        <div
                            className={`div-section w-[150px] h-[150px] md:w-[250px] md:h-[250px] relative overflow-hidden rounded-lg cursor-pointer ${
                                selectedCategory === section.title ? "ring-1 ring-[#000]" : ""
                            }`}
                            key={index}
                            onClick={() => handleSectionCategoryClick(section.title)}
                        >
                            <img src={section.imgSrc} alt={section.alt} />
                            <div className="section-text absolute top-2/4 left-2/4 text-sm md:text-base lg:text-lg">{section.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <section>
            <div className="gender-button flex gap-[50px] md:gap-[100px] justify-center items-center h-[60px] md:h-[80px]">
                <button className="men-button items-center h-[50px] w-[150px] md:h-[60px] md:w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Male')}>Men</button>
                <button className="women-button items-center h-[50px] w-[150px] md:h-[60px] md:w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Female')}>Women</button>
            </div>  
        </section>
        <section className="relative">
            <div id="product" className="landing-dashboard flex flex-wrap md:flex-nowrap justify-end overflow-y-hidden">
                <section className="w-full md:w-[15%] flex flex-col">
                    <div
                        className="filter-column rounded-bl-[8px] pl-[10px] md:pl-[20px]"
                        id="stickyDiv"
                        style={{
                            position: "sticky",
                            top: "60px",
                            height: "calc(100vh - 60px - 64px)",
                            maxHeight: "calc(100vh - 60px - 64px)",
                            overflowY: "auto"
                        }}
                    >
                        {filterMet.map((item, index) => (
                            <div key={index} className="filter-dropdown max-w-full max-h-[500px] rounded-sm">
                                <div key={item.title}>
                                    <p className={isCollapsed ? "m-0 items-center flex" : "collapsed m-0 items-center flex text-sm md:text-base"}><strong>{item.title}</strong></p>
                                    <div className="collections p-[5px] md:p-[10px] max-h-[300px] md:max-h-[400px] overflow-y-auto">
                                        <ul className="list-none p-0 m-0">
                                            {!isCollapsed && item.list.map((list, index) => (
                                                <li key={index} className="filter-options mt-[5px] max-h-[150px] md:max-h-[200px] overflow-y-auto pr-[5px] cursor-pointer" style={{ backgroundColor: `${currentFilters[item.title]?.[list] ? '#D3D3D3' : ''}` }}>
                                                    <label className="flex items-center mb-[3px] md:mb-[5px]" key={list} value={list} onClick={e => ChangeCurrentFilters(e, item.title, list)}>{list}</label>
                                                    <span className="ml-auto text-xs md:text-sm">{'(' + fetchCount(item.title, list) + ')'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>  
                        ))}
                    </div>
                </section>
                <section className="w-full md:w-[85%]">
                    <div className="grid-container w-full grid gap-[.250rem] h-[calc(100vh-60px-64px)] overflow-y-auto pt-0 pr-2 pb-2 pl-0">
                        {filteredProducts.length !== 0 ? (
                            filteredProducts.map((prod, index) => (
                                <div key={prod._id} className="product-card" onClick={() => sendingProdData(prod._id)}>
                                    <div className="product-image-div mb-3 w-full pt-2.5">
                                        <img className="h-full w-full object-cover product-image" src={`${Object.values(prod.images)[0]}`} />
                                    </div>
                                    <div className="pl-[10px]">
                                        <h3 className="product-name text-sm md:text-base font-bold m-2">{prod.name}</h3>
                                        <p className="product-price">{'₹' + prod.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>
                                <p className="text-center">--- No products to show ---</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </section>
    </div>
    <Footer />
</div>

    );
}

export default Home;