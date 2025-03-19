import '../../App.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { User, Heart, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Home, Import } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faSearchDollar, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

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

const Header: React.FC = () => {
    const [bagItemCount, setBagItemCount] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchPopup,setSearchPopup] = useState(false)
    const [searchFilter,setSearchFilter] = useState([])
    const [search,setSearch] = useState('')
    const [aSearch,setASearch] = useState('')
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(()=>{
        fetchProducts()
    },[])
    
    const toggleSearchBox = () => {
      setShowSearch(!showSearch);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
        .then(res => {
            if (res.data.status === true) {
                setProducts(res.data.products);
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const navigate = useNavigate();
    
    const sendingProdData = (productID : any) => {
        navigate('/ProductCard')
    }
    const navigatetoHome = () => {
        navigate('/')
    }
    const navigatetoFooter = () => {
        navigate('/Footer')
    }

    useEffect(() => {
        setBagItemCount(3);
    }, [])

    const searchFun = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(search === ''){
            alert('Enter something to search')
        }
        else{
            setSearchPopup(true)
            // console.log(search)
            const filterdOne = products.filter(list => {
                const nameArray = list.name.split(' ');
                const arrayOfSizesObjcet = list.sizes && Object.values(list.sizes);

                const matchesColor = list.colors.some((color) =>
                    search.toLowerCase().includes(color.toLowerCase())
                );

            
                const matchesSize = arrayOfSizesObjcet && arrayOfSizesObjcet.some((sizeObject) => {
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
        <div className='fixed w-full top-0 z-50'>
    <section className='sectionheader flex justify-between items-center p-[10px] h-[64px] md:h-[80px] lg:h-[100px]'>
        <div className='left-icons relative flex items-center gap-[20px] w-[24%] md:w-[20%] lg:w-[15%]'>
            <div className="menu-container w-full relative flex items-center justify-start">
                <div className='hahamburgermenu me-2 flex items-center h-[40px]' onClick={toggleMenu}>
                    <img src='./assets/Icons - SVG/hamburger.png'></img>
                </div>
                <div className={`dropdown-menu ${isMenuOpen ? "active top-[50px] left-[60px]" : ""} fixed top-0 left-0 w-[250px] md:w-[300px] lg:w-[350px] rounded-30`}>
                    <div className="close-icon" onClick={toggleMenu}>
                        <img src='./assets/Icons - SVG/Close-Circle--Streamline-Ionic-Filled.svg' alt="Close Icon" />
                    </div>
                    <ul className="menu-items list-none p-[20px] m-0">
                        <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                            <Link to="/">Home</Link>
                        </li>
                        <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                            <a href="#product">Products</a>
                        </li>
                        <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                            <a href="#footer">About Us</a>
                        </li>
                    </ul>
                    <div className="contact mt-30 p-5 text-sm md:text-base">
                        <p className='block'>Contact:</p>
                        <a href="mailto:akashganeshaner@gmail.com">akh@gmail.com</a>
                    </div>
                </div>
                <div className='searchicon flex w-10 h-10 relative justify-center items-center cursor-pointer' onClick={toggleSearchBox}>
                    <img className='w-[40px] h-[40px]' src='src\assets\Icons - SVG\Searchicon.svg' alt="Search Icon" />
                </div>
                {showSearch && (
                    <div className="search-box flex items-center text-center w-[250px] md:w-[300px] lg:w-[350px] absolute top-0 z-50 right-0">
                        <input className='w-full px-3 py-2 text-base border-b border-gray-700' type="text" placeholder="Search here..." 
                            onChange={e=>setSearch(e.target.value)} value={search} />
                        <FontAwesomeIcon className='text-black' onClick={(e)=>{
                                setASearch(search)
                                searchFun(e)
                            }} icon={faSearch} 
                        />
                    </div>
                )}
            </div>
        </div>
        <div className='companyname relative pt-2.5 text-xl md:text-2xl lg:text-3xl tracking-wider'>
            <a href=''>H  C L O T H I N G</a>
        </div>
        <div className='usericon w-[24%] md:w-[20%] lg:w-[15%] flex items-center justify-end h-[40px]'>
            <img src='.\assets\Icons - SVG\Usericon.svg' alt="User Icon" />
        </div>
    </section>
    {searchPopup && (
        <div className="fixed top-[9%] right-0 bottom-0 w-full bg-gray-500 bg-opacity-50 p-5" style={{zIndex:'999'}}>
            <div className="relative bg-white p-2 pe-5 w-full">
                <h3 className="text-center text-3xl font-['Montserrat-Thin'] pb-[10px]">"{searchFilter.length}" Results found for "{aSearch}"</h3>
                <div className="grid-container w-full grid gap-[.250rem] h-[75vh] overflow-y-auto pt-0 pr-4 pb-4 pl-0">
                    {searchFilter.length !== 0 ? searchFilter.map((prod,index) => (
                        <div key={prod} onClick={()=>sendingProdData(prod._id)} className="product-card border">
                            <div className="product-image-div w-full pt-2.5">
                                <img className="h-full w-full object-cover product-image" src={`${Object.values(prod.images)[0]}`} />
                            </div>
                            <div className="pl-[10px] flex items-center">
                                <div>
                                    <h3 className="product-name text-base font-bold m-2">{prod.name}</h3>
                                    <p className="product-price">{'Rs.'+prod.price}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <p className="text-center">--- No products to show ---</p>
                        </div>
                    )}
                </div>
                <div className="absolute top-1 right-2 rounded-full bg-red-500 text-white font-bold px-1.5 py-0" onClick={()=>{
                    setSearchPopup(false)
                    setSearchFilter([])
                }}>
                    <FontAwesomeIcon icon={faXmark}/>
                </div>
            </div>
        </div>
    )}
</div>
    );
}

export default Header;