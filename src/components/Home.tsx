import axios from "axios";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "../App.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User, Heart, ShoppingBag } from 'lucide-react';



interface SizesOptions {
    [key: string]: { [key: string]: string };
}

const initialProductState = {
    name: '',
    price: '',
    category: '',
    subCategory: '',
    material: '',
    totalQuantity: '',
    description: '',
    image: '',
    colors: [] as string[],
    sizes: {},
    trendingProd: false
};

interface Product {
    name: string;
    price: string;
    category: string;
    subCategory: string;
    material: string;
    totalQuantity: string;
    description: string;
    image: string;
    colors: string[];
    sizes: SizesOptions;
    trendingProd: boolean;
}




const Home: React.FC = () => {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [countedProducts, setCountedProducts] = useState(products);
    const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL'])
    const [materials, setMaterials] = useState(['Cotton', 'Nylon', 'Rexin'])
    const [prices, setPrices] = useState(['<500<', '<1000<', '<2000<', '<3000<'])
    const [colors, setColors] = useState(["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"])
    const [isSticky, setIsSticky] = useState(false)
    const [bagItemCount, setBagItemCount] = useState(0)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    useEffect(() => {
        fetchProducts()

    }, [])

    useEffect(() => {
        setBagItemCount(3) // Example: 3 items in the bag
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
            .then(res => {
                if (res.data.status === true) {
                    setProducts(res.data.products);
                    setCountedProducts(res.data.products);
                    setSortedProducts(res.data.products);
                    console.log(res.data.products)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Generate counts for the filters

    const fetchCountforFiltersbyMaterial = (material: string) => {
        var countforMaterial = 0;
        countedProducts.forEach(prod => {
            if (prod.material == material) {
                countforMaterial = countforMaterial + parseInt(prod.totalQuantity)
            }
        });
        //console.log("Material count : ", countforMaterial);
        return countforMaterial.toString();
    }

    const fetchCountforFiltersbyPrice = (price: string) => {
        var countforprice = 0;
        price = price.slice(1, length - 1)
        //console.log(price);
        countedProducts.forEach(prod => {
            if (parseInt(prod.price) <= parseInt(price)) {
                countforprice = countforprice + parseInt(prod.totalQuantity)
            }
        });
        //console.log("Material count : ", countforMaterial);
        return countforprice.toString();
    }

    const fetchCountforFiltersbyColor = (color: string) => {
        var countforColors = 0;
        countedProducts.forEach(item => {
            for (const size in item.sizes[color]) {
                //console.log("Size Count : ", color);
                console.log("Size Count : ", item.sizes[color][size]);
                countforColors = countforColors + parseInt(item.sizes[color][size]);
            }
        });
        //console.log("Size Count : ", totalCount);
        return countforColors.toString();
    }

    const fetchCountforFiltersbySize = (size: string) => {
        let totalCount = 0;

        // Loop through each item to check if the size exists in any color
        countedProducts.forEach(item => {
            for (const color in item.sizes) {
                //console.log("Size Count : ", color);
                if (item.sizes[color][size]) {
                    //console.log("Size Count : ", item.sizes[color][size]);
                    totalCount = totalCount + parseInt(item.sizes[color][size]);

                }
            }
        });
        //console.log("Size Count : ", totalCount);
        return totalCount.toString();
    }

    //Ordering the showing columns

    const orderbyPrice = (price: string) => {
        price = price.slice(1, length - 1)
        var sortedProducts = products.filter(prod => parseInt(prod.price) >= parseInt(price))

        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setSortedProducts(sortedProducts);
        }
    }
    const orderbyMaterial = (material: string) => {
        var sortedProducts = products.filter(prod => prod.material === material)
        if (sortedProducts.length > 0) {
            sortedProducts.includes(sortedProducts);
        }
        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setSortedProducts(sortedProducts);
        }
    }
    const orderbyColor = (color: string) => {

        var sortedProducts = products.filter(prod => prod.colors === color)

        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setSortedProducts(sortedProducts);
        }
    }
    const orderbySize = (size: string) => {

        var sortedProducts = products.filter(prod => prod.size === size)

        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setSortedProducts(sortedProducts);
        }
    }

    return (

        <div className="dashboard-container">
            <section>
                <nav className="navbar">

                    <ul className="navbar-links">
                        <li><a href="/collections">Contact us</a></li>
                        <li><a href="/new-arrivals">About</a></li>
                    </ul>
                    <div className="navbar-logo">
                        <a href="/">HarishClothing</a>
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
            <div className="carousel-container" style={{ backgroundColor: '#D2B48C', borderRadius: '8px 8px 8px 0' }}>
                <h2 style={{ color: '#F5F5F5' }}>Trending Products</h2>
                <Slider {...settings}>
                    {
                        products.length !== 0 ? products.map((trendprod) => {
                            if (trendprod.trendingProd) {
                                return <div className="carousel-slide">
                                    <img className="carousel-image" src={`${trendprod.image}`} />
                                    <h3 className="carousel-title">{trendprod.name}</h3>
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
            <div className="dashboard-sections">
                <section className="section add-trending-product" style={{ width: '100%', backgroundColor: '#D2B48C', borderRadius: '0 0 0 8px' }}>
                    <h2>Filter</h2>
                    <p>Materials</p>
                    <div>
                        {
                            materials.length !== 0 ? materials.map((mat) => {
                                return <div key={mat}>
                                    <div style={{ display: 'flex', alignItems: 'center' }} key={mat}>
                                        <label>
                                            <input type="checkbox" value={mat} onChange={() => orderbyMaterial(mat)}></input>
                                            {mat} : {fetchCountforFiltersbyMaterial(mat)}
                                        </label>
                                    </div>
                                </div>
                            })
                                :
                                <div>
                                    <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                                </div>
                        }
                    </div>
                    <p>Sizes</p>
                    <div>
                        {
                            sizes.length !== 0 ? sizes.map((size) => {
                                return <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>
                                            <input type="checkbox" value={size} onChange={() => orderbySize(size)}></input>
                                            {size} : {fetchCountforFiltersbySize(size)}
                                        </label>
                                    </div>
                                </div>
                            })
                                :
                                <div>
                                    <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                                </div>
                        }
                    </div>
                    <p>Prices</p>
                    <div>
                        {
                            prices.length !== 0 ? prices.map((price) => {
                                return <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>
                                            <input type="checkbox" value={price} onChange={() => orderbyPrice(price)}></input>
                                            {price} : {fetchCountforFiltersbyPrice(price)}
                                        </label>
                                    </div>
                                </div>
                            })
                                :
                                <div>
                                    <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                                </div>
                        }
                    </div>
                    <p>Colors</p>
                    <div>
                        {
                            colors.length !== 0 ? colors.map((color) => {
                                return <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>
                                            <input type="checkbox" value={color} onChange={() => orderbyColor(color)}></input>
                                            {color} : {fetchCountforFiltersbyColor(color)}
                                        </label>
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
                <section className="section add-trending-product" style={{ width: '96%' }}>
                    <h2>Products</h2>
                    <div className="grid-container">
                        {
                            sortedProducts.length !== 0 ? sortedProducts.map((prod) => {
                                return <div className="product-card">
                                    <div>
                                        <img className="product-image" src={`${prod.image}`} />
                                    </div>
                                    <div>
                                        <div>
                                            <p className="product-name">{prod.name}</p>
                                            <p className="product-price">{prod.price + ' RS'}</p>
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
        </div>

    );
}

export default Home;