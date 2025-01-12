import '../../App.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { User, Heart, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from "react";
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
            <section className='sectionheader flex justify-between items-center p-[10px] h-[64px]'>
                <div className='left-icons relative flex items-center gap-[20px] w-[24%]'>
                    <div className="menu-container w-full relative flex items-center justify-start">
                        <div className='hahamburgermenu me-2 flex items-center h-[40px]' onClick={toggleMenu}>
                            <img src='src\assets\Icons - SVG\hamburger.png'></img>
                        </div>

                        <div className={`dropdown-menu ${isMenuOpen ? "active top-[50px] left-[60px]" : ""} fixed top-0 left-0 w-[250px] rounded-30`}>
                            <div className="close-icon" onClick={toggleMenu}>
                                <img src='src\assets\Icons - SVG\Close-Circle--Streamline-Ionic-Filled.svg' alt="Close Icon" />
                            </div>
                            <ul className="menu-items list-none p-[20px] m-0">
                                <li className='my-[10px]'>
                                    <a className='text-[20]px' href="#">Home</a>
                                </li>
                                <li className='my-[10px]'>
                                    <a className='text-[20]px' href="#">About us</a>
                                </li>
                                <li className='my-[10px]'>
                                    <a className='text-[20]px' href="#">Products</a>
                                </li>
                            </ul>
                            <div className="contact mt-30 p-5 text-base">
                                <strong className='block'>Contact:</strong>
                                <p>akh@gmail.com</p>
                            </div>
                        </div>

                        <div className='searchicon flex w-10 h-10 relative justify-center items-center cursor-pointer' onClick={toggleSearchBox}>
                            <img className='w-[40px] h-[40px]' src='src\assets\Icons - SVG\Searchicon.svg' alt="Search Icon" />
                        </div>

                        {showSearch && (
                        <div className="search-box flex items-center text-center w-[250px] absolute top-0 z-50 right-0">
                            <input className='w-full px-3 py-2 text-base border-b border-gray-700' type="text" placeholder="Search here..." 
                                onChange={e=>setSearch(e.target.value)} value={search} />
                            <FontAwesomeIcon className='text-black'  onClick={(e)=>{
                                    setASearch(search)
                                    searchFun(e)
                                }} icon={faSearch} 
                            />
                            {/* <img onClick={(e)=>headersearchFun(e)} src='src\assets\Search-Circle--Streamline-Ionic-Filled.svg'/> */}
                        </div>
                    )}
                        
                    </div>
                </div>
                <div className='companyname relative pt-2.5 text-xl tracking-wider'>
                    <a href=''>H  C L O T H I N G</a>
                </div>
                <div className='usericon w-[24%] flex items-center justify-end h-[40px]'>
                    <img src='src\assets\Icons - SVG\Usericon.svg' alt="User Icon" />
                </div>
            </section>
            {searchPopup &&
                <div className="fixed top-[9%] right-0 bottom-0 w-full bg-gray-500 bg-opacity-50 p-5" style={{zIndex:'999'}}>
                    <div className="relative bg-white p-2 pe-5 w-full">
                        <h3 className="text-center text-3xl font-bold underline">"{searchFilter.length}" Results found for "{aSearch}"</h3>
                        {
                            searchFilter.length !== 0 ? searchFilter.map((prod,index) => {
                                return  <div key={prod} className="mb-3" style={{border:'1px solid gray',margin:'5px',padding:'5px',display:'flex',alignItems:'center',width:'100%',maxHeight:'150px',overflow:"hidden"}}>
                                            <div className="font-bold text-xl me-2">{index+1} </div>
                                            <div style={{width:'29%',overflow:"hidden"}}>
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
                        <div className="absolute top-1 right-2 rounded-full bg-red-500 text-white font-bold px-1.5 py-0" onClick={()=>{
                            setSearchPopup(false)
                            setSearchFilter([])
                        }}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Header;