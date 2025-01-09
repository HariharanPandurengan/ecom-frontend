import '../../App.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { User, Heart, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { Home, Import } from 'lucide-react';

const Header: React.FC = () => {
    const [bagItemCount, setBagItemCount] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [search,setSearch] = useState('')
    
    const toggleSearchBox = () => {
      setShowSearch(!showSearch);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const headersearchFun =(e:React.MouseEvent<HTMLImageElement>) => {
        searchFun(e)
      }
    useEffect(() => {
        setBagItemCount(3);
    }, [])
    return (
        <div>
        <section className='sectionheader'>
            <div className='left-icons'>
                <div className="menu-container">
                    <div className='hahamburgermenu' onClick={toggleMenu}>
                        <img src='src\assets\Icons - SVG\hamburger.png'></img>
                    </div>

                    <div className={`dropdown-menu ${isMenuOpen ? "active" : ""}`}>
                        <div className="close-icon" onClick={toggleMenu}>
                            <img src='src\assets\Icons - SVG\Close-Circle--Streamline-Ionic-Filled.svg' alt="Close Icon" />
                        </div>
                        <ul className="menu-items">
                        <li>
                            <a href="#">Home</a>
                        </li>
                        <li>
                            <a href="#">About us</a>
                        </li>
                        <li>
                            <a href="#">Products</a>
                        </li>
                        </ul>
                        <div className="contact">
                            <strong>Contact:</strong>
                            <p>akh@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className='searchicon' onClick={toggleSearchBox}>
                    <img src='src\assets\Icons - SVG\Searchicon.svg' alt="Search Icon" />
                </div>
                {showSearch && (
                    <div className="search-box">
                        <input type="text" placeholder="Search here..." 
                        onChange={e=>setSearch(e.target.value)} value={search} />
                        <img onClick={(e)=>headersearchFun(e)} src='src\assets\Icons - SVG\Search-Circle--Streamline-Ionic-Filled.svg'/>
                    </div>
                )}
            </div>
            <div className='companyname'>
                <a href=''>H - CLOTHING</a>
            </div>
            <div className='usericon'>
                <img src='src\assets\Icons - SVG\Usericon.svg' alt="User Icon" />
            </div>
        </section>
        </div>
    );
}

export default Header;