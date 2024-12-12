import '../../App.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User, Heart, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from "react";

const Header: React.FC = () => {
    const [bagItemCount, setBagItemCount] = useState(0)

    useEffect(() => {
        setBagItemCount(3);
    }, [])
    return (
        <section>
            <nav className="navbar">

                <ul className="navbar-links">
                    <li><a href="/collections">Contact</a></li>
                    <li><a href="/new-arrivals">About</a></li>
                </ul>
                <div className="navbar-logo">
                    <a href="/">Clothing</a>
                </div>
                <div className="navbar-actions">
                    <a href="/Admin" className="navbar-action"><User /></a>
                    <a href="/favourites" className="navbar-icon" aria-label="Favourites">
                        <Heart />
                    </a>
                    <a href="/cart" className="navbar-icon" aria-label="Add to Bag">
                        <ShoppingBag />
                        {bagItemCount > 0 && (
                            <span>
                                {bagItemCount}
                            </span>
                        )}
                    </a>
                </div>
            </nav>
        </section>
    );
}

export default Header;