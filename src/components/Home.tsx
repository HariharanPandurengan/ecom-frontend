import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./Header,Footer/Header";
import { useNavigate } from "react-router-dom";
import Footer from "./Header,Footer/Footer";
import TrendingSectionImage from "../assets/Pictures/blueShirt.jpg"
import ShirtsSectionImage from "../assets/Pictures/pink shirt.jpg"
import TShirtSectionImage from "../assets/Pictures/yellow shirt.jpg"
import PantsSectionImage from "../assets/Pictures/purple shirt.jpg"
import PromoVideo from "../assets/Pictures/promo-video.gif"
import { FaFilter } from "react-icons/fa"; // Add this import at the top with other imports
import { FaTimes } from "react-icons/fa"; // Add this import for the x-mark icon
import { ShoppingBag } from 'lucide-react';
import { image } from "framer-motion/client";

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

  interface trendings {
    id : string;
    name: string;
    price: string;
    images: Image;
  }
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [trendings, setTrendings] = useState<trendings[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentFilters, setCurrentFilters] = useState<Record<string, Record<string, boolean>>>({});
    const [isSticky, setIsSticky] = useState(false)
    const [bagItemCount, setBagItemCount] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [collapsedItems, setCollapsedItems] = useState({});
    

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
    const promoVideo = {
        name : "The Nirah",
        price : "The Nirah — from “Niram,” Tamil for colour. Crafted to simplify a man’s wardrobe, not complicate it. Essentials that build confidence, not confusion. Thoughtfully made across India. Because real style starts with the right basics.",
        image : {PromoVideo}
    }
    const [isCollapsed, setIsCollapsed] = useState(true);
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
        autoplaySpeed: 5000,
        arrows: false, // Remove arrows
        dots: true,    // Show dots navigation
    };

    useEffect(() => {
        async function fp() {
          await fetchProducts()
        }
        fp();
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
        if(sessionStorage.getItem("cartId") === null || sessionStorage.getItem("cartId") === "" || sessionStorage.getItem("cartId") === undefined){
            setBagItemCount(false)
        }
        else{
            setBagItemCount(true)
        }
    }, [])

    const fetchProducts = async () => {
        await axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
            .then(res => {
                if (res.data.status === true) {
                    setProducts(res.data.products);
                    const trend = res.data.products.filter((item: Product) => item.trendingProd === true) ;
                    setTrendings([{
                                id : "promo-video",
                                name : "The Nirah",
                                price : "The Nirah — from “Niram,” Tamil for colour. Crafted to simplify a man’s wardrobe, not complicate it. Essentials that build confidence, not confusion. Thoughtfully made across India. Because real style starts with the right basics.",
                                images : {PromoVideo}
                    }])
                    setTrendings(prev => [...prev, ...trend.map((item: Product) => ({
                        id : item._id,
                        name: "",
                        price: "",
                        images: item.images
                    }))])
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
        let filteredOne: any[] | ((prevState: Product[]) => Product[]) = [];
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

    // For draggable cart icon
    const [cartIconPos, setCartIconPos] = useState<{ x: number; y: number }>({ x: 1400, y: 5 });
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [dragMoved, setDragMoved] = useState(false);

    // Mouse/touch event handlers for drag
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

    // Cart icon click handler: only navigate if not dragging
    const handleCartClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragMoved) {
            navigate('/CheckoutPage');
        }
    };

    const toggleCollapse = (title) => {
        setCollapsedItems(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };


    return (
        <div className="min-h-screen w-full overflow-hidden flex flex-col">
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
                        display: grid !important;
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
                        min-height: 200px !important;
                        // max-height: 180px !important;
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
                        min-height: 200px !important;
                        // max-height: 120px !important;
                    }
                    .grid-container {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
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
    {/* Draggable Floating Cart Icon */}
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
    <div>
        <Header />
    </div>
    <div className="h-clothingpage mt-[60px] max-w-fit items-center flex-grow">
    <section>
        <div className="carousel-container relative w-full max-h-[700px] max-w-[800px] m-auto overflow-hidden">
            <Slider {...settings}>
                {products.length !== 0 ? (
                    trendings.map((trendprod, index) =>
                        trendprod ? (
                            <div key={index} className="carousel-slides flex relative">
                                <div className="carousel-slide min-w-full text-center relative">
                                    {/* Overlay for product info */}
                                    <div
                                        className="absolute top-0 right-0 w-auto h-auto flex flex-col items-end justify-right z-10 p-6"
                                        style={{
                                            background: "none",
                                            color: "#fff",
                                            pointerEvents: "none"
                                        }}
                                    >
                                        <div
                                            className="mb-1 text-2xl font-bold drop-shadow"
                                            style={{
                                                fontFamily: trendprod.name === "The Nirah" ? "Didot" : "Playfair-display",
                                                pointerEvents: "auto"
                                            }}
                                        >
                                            {trendprod.name}
                                        </div>

                                        <div
                                            className="mb-2 drop-shadow"
                                            style={{
                                                fontFamily: "Lato",
                                                fontSize: trendprod.name === "The Nirah" ? "0.9rem" : "1.125rem", // text-sm
                                                textAlign: "right",
                                                pointerEvents: "auto",
                                            }}
                                        >
                                                {trendprod.price}
                                        </div>

                                        {trendprod.name !== "The Nirah" && (
                                            <button
                                                className="px-4 py-1 rounded bg-[#7B3F14] text-white font-bold text-base transition-colors"
                                                style={{
                                                    opacity: 0.5,
                                                    pointerEvents: "auto",
                                                    cursor: "pointer",
                                                    fontFamily: "Playfair-display"
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    sendingProdData(trendprod.id);
                                                }}
                                                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#000")}
                                                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#7B3F14")}
                                            >
                                                Buy Now
                                            </button>
                                        )}
                                    </div>

                                    {/* Graded out image */}
                                    <img
                                        className="block w-full"
                                        loading="lazy"
                                        height="100%"
                                        width="100%"
                                        src={`${trendprod.images && Object.values(trendprod.images)[0]}`}
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
                <h1
                    className="text-base sm:text-lg md:text-xl lg:text-2xl"
                    style={{
                        fontFamily: "Lato, sans-serif",
                        fontSize: "2rem",
                        marginBottom: "0.5rem"
                    }}
                >
                    SHOP BY SECTION
                </h1>
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
        {/* <section>
            <div className="gender-button flex gap-[50px] md:gap-[100px] justify-center items-center h-[60px] md:h-[80px]">
                <button className="men-button items-center h-[50px] w-[150px] md:h-[60px] md:w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Male')}>Men</button>
                <button className="women-button items-center h-[50px] w-[150px] md:h-[60px] md:w-[200px]" onClick={e => ChangeCurrentFilters(e, 'sex', 'Female')}>Women</button>
            </div>  
        </section> */}
        <section className="relative">
            <div id="product" className="landing-dashboard flex flex-wrap md:flex-nowrap justify-end overflow-y-hidden">
                <section className="w-full md:w-[15%] flex flex-col">
                    {/* Filter icon and text for all screens */}
                    <div
                        className="mb-2 flex items-center select-none relative"
                        style={{
                            width: "100%",
                            fontFamily: "Lato",
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            color: "#000",
                            userSelect: "none",
                        }}
                        >
                        {/* X-mark icon moved to left */}
                        <span
                            className="flex items-center cursor-pointer"
                            style={{ color: "#7B3F14", paddingLeft: 8 }}
                            onClick={(e) => {
                            e.stopPropagation();
                            setCurrentFilters((prev) => {
                                const reset = { ...prev };
                                Object.keys(reset).forEach((key) => {
                                Object.keys(reset[key]).forEach((k2) => {
                                    reset[key][k2] = false;
                                });
                                });
                                return reset;
                            });
                            setSelectedCategory(null);
                            }}
                            title="Clear all filters"
                        >
                            <FaTimes size={16} />
                        </span>

                        {/* Filter toggle now on the right */}
                        <div
                            className="cursor-pointer flex items-center gap-2 ml-auto"
                            onClick={() => setIsCollapsed((prev) => !prev)}
                        >
                            <FaFilter size={18} />
                            <span>Filter</span>
                            <span style={{ fontSize: "0.9em", marginLeft: 4 }}>
                            {isCollapsed ? "(Show)" : "(Hide)"}
                            </span>
                        </div>
                    </div>
                    {/* Filter column, hidden on mobile if collapsed */}
                    <div
                        className="filter-column rounded-bl-[8px] pl-[10px] md:pl-[20px]"
                        id="stickyDiv"
                        style={{
                            position: "sticky",
                            top: "60px",
                            height: "calc(100vh - 60px - 64px)",
                            maxHeight: "calc(100vh - 60px - 64px)",
                            overflowY: "auto",
                            display: isCollapsed ? "none" : "block"
                        }}
                    >
                    {filterMet.map((item, index) => (
                        <div
                            key={index}
                            className="filter-dropdown max-w-full max-h-[500px] rounded-sm"
                        >
                            <div key={item.title}>
                            <div
                                className="flex items-center justify-between cursor-pointer text-sm md:text-base px-[5px] md:px-[10px] py-[5px]"
                                onClick={() => toggleCollapse(item.title)}
                            > <p>
                                <strong>{item.title}</strong>
                                </p>
                                <span
                                className={`transition-transform duration-300 ${
                                    collapsedItems[item.title] ? 'rotate-180' : ''
                                }`}
                                >
                                ▼
                                </span>
                            </div>

                            {!collapsedItems[item.title] && (
                                <div className="collections p-[5px] md:p-[10px] max-h-[300px] md:max-h-[400px] overflow-y-auto">
                                <ul className="list-none p-0 m-0">
                                    {item.list.map((list, idx) => (
                                    <li
                                        key={idx}
                                        className="filter-options mt-[5px] max-h-[150px] md:max-h-[200px] overflow-y-auto pr-[5px] cursor-pointer flex justify-between items-center"
                                        style={{
                                        backgroundColor: currentFilters[item.title]?.[list]
                                            ? '#D3D3D3'
                                            : '',
                                        }}
                                    >
                                        {fetchCount(item.title, list) > 0 && (
                                        <label
                                            className="mb-[3px] md:mb-[5px] cursor-pointer"
                                            key={list}
                                            value={list}
                                            onClick={(e) =>
                                            ChangeCurrentFilters(e, item.title, list)
                                            }
                                        >
                                            {list}
                                        </label>
                                        )}
                                        {fetchCount(item.title, list) > 0 && (
                                        <span className="text-xs md:text-sm">
                                            ({fetchCount(item.title, list)})
                                        </span>
                                        )}
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                </section>
                <section className="w-full md:w-[85%]" id="productSection">
                    <div className="grid-container w-full grid gap-[.250rem] h-[calc(100vh-60px-64px)] overflow-y-auto pt-0 pr-2 pb-2 pl-0">
                        {filteredProducts
                        .filter(prod => {
                            // Check if any color/size has quantity < 5
                            return Object.entries(prod.sizes || {}).every(([color, sizeMap]) => {
                            return Object.values(sizeMap).every(qty => parseInt(qty, 10) >= 2);
                            });
                        })
                        .map((prod, _index) => (
                            <div key={prod._id} className="product-card" onClick={() => sendingProdData(prod._id)}>
                                <div className="product-image-div mb-3 w-full pt-2.5">
                                    <img className="h-full w-full object-cover product-image" src={`${(prod.images && Object.values(prod.images).length !== 0) && Object.values(prod.images)[0]}`} />
                                </div>
                                <div className="pl-[10px]">
                                    <h3 className="product-name text-sm md:text-base font-bold m-2">{prod.name}</h3>
                                    <p className="product-price">{'₹' + prod.price}</p>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </section>
            </div>
        </section>
    </div>
    <section id="footer" className="mt-4">
    <Footer />
    </section>
</div>

    );
}

export default Home;