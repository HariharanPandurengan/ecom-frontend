import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User, Heart, ShoppingBag } from 'lucide-react';
import Header from "./Header,Footer/Header";

interface SizesOptions { 
    [key: string]: { [key: string]: string }; 
}

interface Image { 
    [key: string]:  string ; 
}

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

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentFilters, setCurrentFilters] = useState<Record<string, Record<string, boolean>>>({});
    const [isSticky, setIsSticky] = useState(false)
    const [bagItemCount, setBagItemCount] = useState(0)
    const [search,setSearch] = useState('')
    const [searchPopup,setSearchPopup] = useState(false)
    const [searchFilter,setSearchFilter] = useState([])
    const filterMet = [
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
        if (title == 'material') {
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

    useEffect(() => {
        let AllFalse = true;
        let material = false;
        let price = false;
        let colors = false;
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
                    if (key === 'colors') {
                        colors = true;
                        whichColor = key2
                    }
                }
            }
        }

        if (AllFalse === true) {
            setFilteredProducts(products)
        }
        else {
            const filteredOne = [];
            for (let key in currentFilters) {
                for (let key2 in currentFilters[key]) {
                    if (currentFilters[key][key2] === true) {
                        if (key === 'material') {
                            for (let i = 0; i < products.length; i++) {
                                if (products[i]['material'].toLocaleLowerCase() === key2.toLocaleLowerCase()) {
                                    filteredOne.push(products[i])
                                }
                            }
                        }
                        else if (key === 'price') {
                            let priceLimit: any = [];
                            if (key2.includes('-')) {
                                priceLimit = key2.split('-')
                                if (!material) {
                                    for (let i = 0; i < products.length; i++) {
                                        if (Number(products[i]['price']) >= Number(priceLimit[0]) && Number(products[i]['price']) <= Number(priceLimit[1])) {
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === products[i]['_id']
                                            })
                                            if (alreadyExist.length === 0) {
                                                filteredOne.push(products[i])
                                            }
                                        }
                                    }
                                }
                                else if (material) {
                                    for (let i = 0; i < filteredOne.length; i++) {
                                        if (!(Number((filteredOne[i]['price']) >= Number(priceLimit[0])) && Number(products[i]['price']) <= Number(priceLimit[1]))) {
                                            filteredOne.splice(i, 1);
                                        }
                                    }
                                }
                            }
                            else {
                                if (!material) {
                                    for (let i = 0; i < products.length; i++) {
                                        if (Number(products[i]['price']) > Number(key2.slice(0, -1))) {
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === products[i]['_id']
                                            })
                                            if (alreadyExist.length === 0) {
                                                filteredOne.push(products[i])
                                            }
                                        }
                                    }
                                }
                                else if (material) {
                                    for (let i = 0; i < filteredOne.length; i++) {
                                        if ((Number(products[i]['price']) > Number(key2.slice(0, -1))) === false) {
                                            filteredOne.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                        else if (key === 'colors') {
                            if (material || price) {
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
                                for (let i = 0; i < products.length; i++) {
                                    const Colorkeys = Object.keys(products[i]['sizes']);
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentColorsArray = Object.values(products[i]['sizes'][Colorkeys[j]]);
                                        if (key2.toLocaleLowerCase() === Colorkeys[j].toLocaleLowerCase()) {
                                            for (let cc = 0; cc < currentColorsArray.length; cc++) {
                                                const total = currentColorsArray.reduce((sum, num) => sum + Number(num), 0);
                                                if (total !== 0) {
                                                    filteredOne.push(products[i])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (key === 'sizes') {
                            if (colors || price || material) {
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
                                for (let i = 0; i < products.length; i++) {
                                    let thisSizeTotalCount = 0;
                                    const Colorkeys = Object.keys(products[i]['sizes']);
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentSizesArray = Object.keys(products[i]['sizes'][Colorkeys[j]]);
                                        const currentSizesValueArray = Object.values(products[i]['sizes'][Colorkeys[j]]);
                                        for (let cc = 0; cc < currentSizesArray.length; cc++) {
                                            if (key2.toLocaleLowerCase() === currentSizesArray[cc].toLocaleLowerCase()) {
                                                thisSizeTotalCount += currentSizesValueArray[cc]
                                            }
                                        }
                                    }
                                    if (thisSizeTotalCount !== 0) {
                                        filteredOne.push(products[i])
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

    const searchFun = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(search === ''){
            alert('Enter something to search')
        }
        else{
            setSearchPopup(true)
            const filterdOne = products.filter(list => {
                const nameArray = list.name.split(' ');
                const arrayOfSizesObjcet = Object.values(list.sizes);

                const matchesColor = list.colors.some((color) =>
                    search.toLowerCase().includes(color.toLowerCase())
                );

                const matchesSize = arrayOfSizesObjcet.some((sizeObject) => {
                    const arrayOfSize = Object.keys(sizeObject);
                    return arrayOfSize.some((size) =>
                    search.toLowerCase().includes(size.toLowerCase())
                    );
                });

                const matchesName = nameArray.some((word) =>
                    search.toLowerCase().includes(word.toLowerCase())
                );

                const matchesOther =
                    list.material.toLowerCase().includes(search.toLowerCase()) ||
                    search.includes(list.price) ||
                    list.name.toLowerCase().includes(search.toLowerCase()) ||
                    search.toLowerCase().includes(list.name.toLowerCase());

                return matchesColor || matchesSize || matchesName || matchesOther;
            })
            setSearchFilter(filterdOne)
        }
    }

    return (
        <div className="h-clothingpage">
            <Header></Header>
            <section>
                <div className="carousel-container">
                    <Slider {...settings}>
                        {
                            products.length !== 0 ? products.map((trendprod) => {
                                if (trendprod.trendingProd) {
                                    return <div className=".carousel-slides">
                                                <div className="carousel-slide">
                                                    <img src={`${Object.values(trendprod.images)[0]}`} alt="promotion" />
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
            <div className="shop-by-section">
                <h1>SHOP BY SECTION</h1>
                    <div className="sections-container">
                        {sections.map((section, index) => (
                        <div className="div-section" key={index}>
                            <img src={section.imgSrc} alt={section.alt} />
                            <div className="section-text">{section.title}</div>
                        </div>
                        ))}
                    </div>
            </div>
            </section>
            <section>
                <div className="gender-button">
                    <button className="men-button">Men</button>
                    <button className="women-button">Women</button>
                </div>
            </section>
            <section>
                <div className="landing-dashboard">
                    <section>
                    <div className="filter-column">
                        {
                        filterMet.map(item => {
                            return <div className="filter-dropdown">
                                    <div key={item.title} >
                                        <p style={{ fontFamily: 'Montserrat', textTransform: 'capitalize', color: '#000000' }} onClick={() => setIsCollapsed(!isCollapsed)} className={isCollapsed ? "" : "collapsed"}><strong>{item.title}</strong></p>
                                        <div className="collections">
                                            <ul style={{ marginTop: '0' }}>
                                                {
                                                    !isCollapsed && item.list.map(list => {
                                                        return <li className="filter-options" style={{ backgroundColor: `${currentFilters[item.title]?.[list] ? '#D3D3D3' : ''}`, paddingLeft: `${currentFilters[item.title]?.[list] ? '5px' : ''}` }}>
                                                            <label key={list} value={list} onClick={e => ChangeCurrentFilters(e, item.title, list)}>{list}</label>
                                                            <span>{'(' + fetchCount(item.title, list) + ')'}</span>
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
                    <section>
                        <div className="grid-container">
                            {
                                filteredProducts.length !== 0 ? filteredProducts.map((prod, index) => {
                                    return <div key={prod} className="product-card">
                                            <img className="product-image" src={`${Object.values(prod.images)[0]}`} />
                                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                            <div style={{ alignItems: 'center' }}>
                                                <h3 className="product-name">{prod.name}</h3>
                                                <p className="product-description">{prod.description}</p>
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
            <section>
                <div className="w-full my-2 border border-gray-900 p-1 flex items-center">
                    <input 
                        className="border-2 border-gray-400 rounded-lg w-[80%] py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        type="text" 
                        placeholder="Search..."
                        onChange={e=>setSearch(e.target.value)} value={search} 
                    />
                    <button onClick={(e)=>searchFun(e)} className="w-[20%] ml-3 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Search</button>
                </div>
            </section>
            {searchPopup &&
                <div className="fixed top-[13%] right-0 bottom-0 w-full bg-gray-500 bg-opacity-50 p-5" style={{zIndex:'999'}}>
                    <div className="bg-white p-2 pe-5">
                        <h3 className="text-center text-3xl font-bold underline">{searchFilter.length} Results found for "{search}"</h3>
                        {
                            searchFilter.length !== 0 ? searchFilter.map((prod,index) => {
                                return  <div key={prod} className="mb-3" style={{border:'1px solid gray',margin:'5px',padding:'5px',display:'flex',alignItems:'center',width:'100%',maxHeight:'150px',overflow:"hidden"}}>
                                            <div style={{width:'30%',overflow:"hidden"}}>
                                                <img style={{width:'100%'}} src={`${Object.values(prod.images)[0]}`} />
                                            </div>
                                            <div style={{display:'flex',alignItems:'center',marginLeft:'10px'}}>
                                                <h3>{(index+1)+'. '}</h3>
                                                <div style={{display:'flex',alignItems:'center'}}>
                                                    <h3 style={{marginRight:'10px'}}>{prod.name}</h3>
                                                    <p style={{marginRight:'10px'}}>| {prod.price+' RS'} |</p>
                                                    <p>{prod.material} |</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                            })
                           :
                           <div>
                                <p style={{textAlign:'center'}}>--- No products to show ---</p>
                           </div>
                        }
                    </div>
                </div>
            }
        </div>

    );
}

export default Home;