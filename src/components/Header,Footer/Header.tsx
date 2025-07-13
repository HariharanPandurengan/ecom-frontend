import '../../App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { User, Heart, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import hahaburgermenu from "../../assets/Icons - SVG/hamburger.png";
import closeIcon from "../../assets/Icons - SVG/Close-Circle--Streamline-Ionic-Filled.svg"
import searchIcon from "../../assets/Icons - SVG/Searchicon.svg"
import usericon from "../../assets/Icons - SVG/Usericon.svg"


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
  const [userName, setUserName] = useState<string | null>(null);
  const [bagItemCount, setBagItemCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchPopup,setSearchPopup] = useState(false)
  const [searchFilter, setSearchFilter] = useState<Product[]>([])
  const [search,setSearch] = useState('')
  const [aSearch,setASearch] = useState('')
  const [products, setProducts] = useState<Product[]>([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

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
  
const handleClick = () => {
    navigate("/", { state: { scrollTo: "productSection" } }); // pass the target section name
  };

  const handleFooterClick = () => {
    navigate("/", { state: { scrollTo: "footer" } }); // pass the target section name
  };

  const sendingProdData = (productID : any) => {
      navigate('/ProductCard')
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

  useEffect(() => {
    // Get user data from sessionStorage
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || null);
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, []);

  return (
    <div className='fixed w-full top-0 z-50'>
        {/* Floating Cart Icon removed from header */}
        <section className='sectionheader flex justify-between items-center p-[10px] h-[64px] md:h-[80px] lg:h-[100px]'>
            <div className='left-icons relative flex items-center gap-[20px] w-[24%] md:w-[20%] lg:w-[15%]'>
                <div className="menu-container w-full relative flex items-center justify-start">
                    <div className='hahamburgermenu me-2 flex items-center h-[40px]' onClick={toggleMenu}>
                        <img src={hahaburgermenu}></img>
                    </div>
                    <div className={`dropdown-menu ${isMenuOpen ? "active top-[50px] left-[60px]" : ""} fixed top-0 left-0 w-[250px] md:w-[300px] lg:w-[350px] rounded-30`}>
                        <div className="close-icon" onClick={toggleMenu}>
                            <img src={closeIcon} alt="Close Icon" />
                        </div>
                        <ul className="menu-items list-none p-[20px] m-0">
                            <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                                <Link to="/">Home</Link>
                            </li>
                            <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                                <a onClick={handleClick}>Products</a>
                            </li>
                            <li className='my-[10px] text-base md:text-lg lg:text-xl'>
                                <a onClick={handleFooterClick}>About us</a>
                            </li>
                        </ul>
                        <div className="contact mt-30 p-5 text-sm md:text-base">
                            <p className='block'>Contact:</p>
                            <a href="mailto:akashganeshaner@gmail.com">thenirah@gmail.com</a>
                        </div>
                    </div>
                    <div className='searchicon flex w-10 h-10 relative justify-center items-center cursor-pointer' onClick={toggleSearchBox}>
                        <img className='w-[40px] h-[40px]' src={searchIcon} alt="Search Icon" />
                    </div>
                    {showSearch && (
                        <div
                            className="search-box flex items-center text-center w-[250px] md:w-[300px] lg:w-[350px] absolute top-0 z-50 left-12"
                            tabIndex={-1}
                        >
                            <input
                                className='w-full px-3 py-2 text-base border-b border-gray-700'
                                type="text"
                                placeholder="Search here..."
                                onChange={e=>setSearch(e.target.value)}
                                value={search}
                                autoFocus
                                onBlur={e => setShowSearch(false)}
                                // Prevent blur when clicking the search icon
                                onMouseDown={e => e.stopPropagation()}
                            />
                            <FontAwesomeIcon
                                className='text-black'
                                onMouseDown={e => e.preventDefault()}
                                onClick={e=>{
                                    setASearch(search)
                                    searchFun(e)
                                }}
                                icon={faSearch}
                            />
                            +
                        </div>
                    )}
                </div>
            </div>
            <div className='companyname relative pt-2.5 text-xl md:text-2xl lg:text-3xl tracking-wider'>
                <a href='/Home'>T H E &nbsp;&nbsp; N I R A H</a>
            </div>
            <div className='usericon w-[24%] md:w-[20%] lg:w-[15%] flex items-center justify-end h-[40px] relative'>
                <img
                    src={usericon}
                    alt="User Icon"
                    className="cursor-pointer"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                />
                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        width: "250px",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 50,
                        borderRadius: "0 0 16px 16px",
                        minHeight: "220px",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
                            <img src={closeIcon} alt="Close Icon" style={{ cursor: "pointer", width: "28px", height: "28px" }} onClick={() => setIsProfileMenuOpen(false)} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 0 0" }}>
                            <img src={usericon} alt="Profile" style={{ width: "60px", height: "60px", borderRadius: "50%", marginBottom: "8px", border: "2px solid #C8A165" }} />
                            <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#7B3F14", marginBottom: "16px", fontFamily: "Montserrat" }}>{userName}</span>
                        </div>
                        <ul style={{ listStyle: "none", padding: "20px", margin: 0 }}>
                            <li style={{ margin: "14px 0", display: "flex", alignItems: "center" }}>
                                {/* Profile SVG */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                                    <circle cx="12" cy="8" r="4" fill="#000" />
                                    <rect x="4" y="15" width="16" height="6" rx="3" fill="#000" />
                                </svg>
                                <Link to="/CustomerLogin" style={{ color: "#222", fontSize: "1rem", textDecoration: "none", fontFamily: "Montserrat" }}>
                                    Login
                                </Link>
                            </li>
                            <li style={{ margin: "14px 0", display: "flex", alignItems: "center" }}>
                                {/* Cart SVG */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                                    <circle cx="9" cy="21" r="1" fill="#000"/>
                                    <circle cx="20" cy="21" r="1" fill="#000"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <Link to="/CheckoutPage" style={{ color: "#222", fontSize: "1rem", textDecoration: "none", fontFamily: "Montserrat" }}>
                                    Cart
                                </Link>
                            </li>
                            <li style={{ margin: "14px 0", display: "flex", alignItems: "center" }}>
                                {/* Order SVG */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#000"/>
                                    <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff"/>
                                    <rect x="7" y="11" width="10" height="2" rx="1" fill="#fff"/>
                                    <rect x="7" y="15" width="6" height="2" rx="1" fill="#fff"/>
                                </svg>
                                <Link to="/OrderList" style={{ color: "#222", fontSize: "1rem", textDecoration: "none", fontFamily: "Montserrat" }}>
                                    Orders
                                </Link>
                            </li>
                            <li style={{ margin: "14px 0", display: "flex", alignItems: "center" }}>
                                {/* Logout SVG */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                                    <path d="M16 17l5-5-5-5M21 12H9M13 21a9 9 0 1 1 0-18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <button style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#7B3F14", fontWeight: 600, fontFamily: "Montserrat" }} onClick={() => {
                                    // TODO: Add logout logic
                                    sessionStorage.removeItem("user");
                                    sessionStorage.removeItem("userId");
                                    sessionStorage.removeItem("cartId");
                                    setIsProfileMenuOpen(false);
                                    alert("Logged out successfully");
                                    setUserName(null);
                                    window.location.reload();

                                }}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </section>
        {searchPopup && (
            <>
            <style>
                {`
                @media (max-width: 600px) {
                    .search-popup-modal {
                        width: 98vw !important;
                        left: 1vw !important;
                        right: 1vw !important;
                        padding: 0.5rem !important;
                        max-width: 98vw !important;
                    }
                    .search-popup-content {
                        padding: 0.5rem !important;
                        max-width: 98vw !important;
                    }
                    .search-popup-title {
                        font-size: 1.1rem !important;
                        padding-bottom: 0.5rem !important;
                    }
                    .search-popup-slider {
                        height: 320px !important;
                        min-height: 220px !important;
                        max-height: 340px !important;
                    }
                    .product-card img,
                    .product-image-div img {
                        max-width: 120px !important;
                        min-width: 80px !important;
                        max-height: 120px !important;
                        min-height: 80px !important;
                    }
                    .w-10, .h-10, .w-6, .h-6, .w-5, .h-5, .w-4, .h-4 {
                        width: 1.5rem !important;
                        height: 1.5rem !important;
                    }
                    .searchicon img,
                    .usericon img,
                    .hahamburgermenu img {
                        width: 1.5rem !important;
                        height: 1.5rem !important;
                    }
                    .close-icon img {
                        width: 1.2rem !important;
                        height: 1.2rem !important;
                    }
                    .product-card .product-name,
                    .product-card .product-price {
                        font-size: 0.9rem !important;
                    }
                    .search-popup-modal svg,
                    .footer-right svg {
                        width: 1.2rem !important;
                        height: 1.2rem !important;
                    }
                }
                `}
            </style>
            <div className="fixed top-[9%] right-0 bottom-0 w-full bg-gray-500 bg-opacity-50 p-5 flex justify-center items-start z-[999]">
                <div className="search-popup-modal relative bg-white p-2 pe-5 w-full max-w-2xl rounded-md search-popup-content">
                    <h3 className="search-popup-title text-center text-3xl font-['Montserrat-Thin'] pb-[10px]">
                        "{searchFilter.length}" Results found for "{aSearch}"
                    </h3>
                    {/* Mobile: slider, Desktop: grid */}
                    <div className="w-full">
                        <div className="block md:hidden search-popup-slider">
                            {/* Mobile: horizontal scroll/slider */}
                            <div className="flex overflow-x-auto gap-3 pb-2" style={{scrollSnapType: "x mandatory"}}>
                                {searchFilter.length !== 0 ? searchFilter.map((prod, index) => (
                                    <div
                                        key={prod._id || index}
                                        onClick={() => sendingProdData(prod._id)}
                                        className="product-card border min-w-[220px] max-w-[240px] flex-shrink-0"
                                        style={{scrollSnapAlign: "center"}}
                                    >
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
                        </div>
                        <div className="hidden md:block">
                            {/* Desktop: grid */}
                            <div className="grid-container w-full grid gap-[.250rem] h-[75vh] overflow-y-auto pt-0 pr-4 pb-4 pl-0">
                                {searchFilter.length !== 0 ? searchFilter.map((prod, index) => (
                                    <div key={prod._id || index} onClick={() => sendingProdData(prod._id)} className="product-card border">
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
                        </div>
                    </div>
                    <div className="absolute top-1 right-2 rounded-full bg-red-500 text-white font-bold px-1.5 py-0" onClick={()=>{
                        setSearchPopup(false)
                        setSearchFilter([])
                    }}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                </div>
            </div>
            </>
        )}
    </div>
  );
}

export default Header;