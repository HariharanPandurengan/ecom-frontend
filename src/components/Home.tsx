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
    const filterMet = [
        {
            title: 'sex',
            list : ['Male',
                'Female',
                'Unisex']
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
        { title: "Trendings", imgSrc: "src/assets/Pictures/blue shirt.jpg", alt: "Trendings" },
        { title: "Shirts", imgSrc: "src/assets/Pictures/pink shirt.jpg", alt: "Shirts" },
        { title: "T-Shirts", imgSrc: "src/assets/Pictures/yellow shirt.jpg", alt: "T-Shirts" },
        { title: "Pants", imgSrc: "src/assets/Pictures/purple shirt.jpg", alt: "Pants" },
      ];
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
    };

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
        localStorage.setItem('current_product',productID)
        console.log(productID)
        navigate('/ProductCard')
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

        let arr = []

        if(sex){
            arr = products.filter(list => list.sex.toLowerCase().trim() == sexType.toLowerCase().trim())
            filteredOne = arr
        }
        else{
            arr = products
        }
        if (AllFalse === true) {
            setFilteredProducts(products)
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
                            if(sex){
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
    }, [currentFilters])

    return (
        <div>
            <div>
                <Header></Header>
            </div>
            <div className="h-clothingpage mt-[60px] max-w-fit items-center ">
                <section>
                    <div className="carousel-container relative w-full max-h-[700px] max-w-[800px] m-auto overflow-hidden">
                        <Slider {...settings}>
                            {
                                products.length !== 0 ? products.map((trendprod,index) => {
                                    if (trendprod.trendingProd) {
                                        return <div key={index} className=".carousel-slides flex">
                                                    <div className="carousel-slide min-w-full text-center">
                                                        <img className="block w-full" src={`${Object.values(trendprod.images)[0]}`} alt="promotion" />
                                                    </div>
                                                </div>
                                    }
                                })
                                    :
                                    <div>
                                        <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                                    </div>
                            }
                        </Slider>
                    </div>
                </section>
                <section>
                    <div className="shop-by-section m-0 p-0 text-center">
                        <h1>SHOP BY SECTION</h1>
                            <div className="sections-container flex justify-center flex-wrap gap-[60px] p-[20px]">
                                {sections.map((section, index) => (
                                <div className="div-section w-[250px] h-[250px] top-0 relative overflow-hidden rounded-lg" key={index}>
                                    <img src={section.imgSrc} alt={section.alt} />
                                    <div className="section-text absolute top-2/4 left-2/4">{section.title}</div>
                                </div>
                                ))}
                            </div>
                    </div>
                </section>
                <section>
                    <div className="gender-button flex gap-[100px] justify-center items-center h-[80px]">
                        <button className="men-button items-center h-[60px] w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Male')}>Men</button>
                        <button className="women-button items-center h-[60px] w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Female')}>Women</button>
                    </div>  
                </section>
                <section id="ProductSection">
                    <div className="landing-dashboard flex flex-start justify-end">
                        <section className="w-[15%]">
                            <div className={`sticky-div ${isSticky ? 'fixed top-16 w-[15%]' : 'relative'}  filter-column rounded-bl-[8px] pl-[20px] h-[90vh] overflow-y-auto`} id="stickyDiv">
                                {
                                filterMet.map((item,index) => {
                                    return <div key={index} className="filter-dropdown max-w-full max-h-[500px] rounded-sm">
                                            <div key={item.title} >
                                                <p onClick={() => setIsCollapsed(!isCollapsed)} className={isCollapsed ? "m-0 items-center flex" : "collapsed m-0 items-center flex"}><strong>{item.title}</strong></p>
                                                <div className="collections p-[10px] max-h-[400px] overflow-y-auto">
                                                    <ul className="list-none p-0 m-0" style={{ marginTop: '0' }}>
                                                        {
                                                            !isCollapsed && item.list.map((list,index) => {
                                                                return   <li key={index} className="filter-options mt-[5px] max-h-[200px] overflow-y-auto pr-[5px] cursor-pointer" style={{ backgroundColor: `${currentFilters[item.title]?.[list] ? '#D3D3D3' : ''}`, paddingLeft: `${currentFilters[item.title]?.[list] ? '5px' : ''}` }}>
                                                                            <label className="flex items-center mb-[5px]" key={list} value={list} onClick={e => ChangeCurrentFilters(e, item.title, list)}>{list}</label>
                                                                            <span className="ml-auto">{'(' + fetchCount(item.title, list) + ')'}</span>
                                                                        </li>
                                                            })
                                                        }
                                                    </ul>
                                            </div>
                                        </div>
                                    </div>
                                })
                                }
                            </div>
                        </section>
                        <section className="w-[85%]">
                            <div className="grid-container w-full grid gap-[.250rem] h-[200vh] overflow-y-auto pt-0 pr-4 pb-4 pl-0">
                                {
                                    filteredProducts.length !== 0 ? filteredProducts.map((prod, index) => {
                                        return <div key={prod} className="product-card" onClick={()=>sendingProdData(prod._id)}>
                                                    <div className="product-image-div mb-3 w-full pt-2.5">
                                                        <img className="h-full w-full object-cover product-image" src={`${Object.values(prod.images)[0]}`} />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1px' }}>
                                                        <div className="pl-[10px]" style={{ alignItems: 'center' }}>
                                                            <h3 className="product-name text-base font-bold m-2">{prod.name}</h3>
                                                            <p className="product-description m-2">{prod.description}</p>
                                                            <p className="product-price">{'Rs.' + prod.price}</p>
                                                            {/* <p>( {
                                                                prod.colors.map((list, index) => {
                                                                    if (index == prod.colors.length - 1) {
                                                                        return list
                                                                    }
                                                                    else {
                                                                        return list + ' , '
                                                                    }
                                                                })
                                                            } )</p> */}
                                                        </div>
                                                    </div>
                                                </div>
                                    })
                                        :
                                        <div>
                                            <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                                        </div>
                                }
                            </div>
                        </section>
                    </div>
                </section>
            </div>
            <div id="FooterSection">
                <Footer></Footer>
            </div>
        </div>
    );
}

export default Home;