import axios from "axios";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "../App.css";
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
    const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL'])
    const [materials, setMaterials] = useState(['Cotton', 'Nylon', 'Rexin'])
    const [prices, setPrices] = useState(['<500<', '<1000<', '<2000<', '<3000<'])
    const [colors, setColors] = useState(["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"])

    const fields = [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'price', label: 'Product Price', type: 'text' },
        { name: 'category', label: 'Product Category', type: 'text' },
        { name: 'subCategory', label: 'Product Sub Category', type: 'text' },
        { name: 'material', label: 'Product Material', type: 'text' },
        { name: 'totalQuantity', label: 'Product Total Quantity', type: 'text' },
        { name: 'description', label: 'Product Description', type: 'textarea' },
        { name: 'image', label: 'Product Image', type: 'file' },
        { name: 'colors', label: 'Colors Available', type: 'select', options: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"], multiple: true },
    ];
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
            .then(res => {
                if (res.data.status === true) {
                    setProducts(res.data.products);
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
        products.forEach(prod => {
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
        products.forEach(prod => {
            if (parseInt(prod.price) <= parseInt(price)) {
                countforprice = countforprice + parseInt(prod.totalQuantity)
            }
        });
        //console.log("Material count : ", countforMaterial);
        return countforprice.toString();
    }

    const fetchCountforFiltersbyColor = (color: string) => {
        var countforColors = 0;
        products.forEach(item => {
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
        products.forEach(item => {
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
            setProducts(sortedProducts);
        }
    }
    const orderbyMaterial = (material: string) => {

        var sortedProducts = products.filter(prod => prod.material === material)

        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setProducts(sortedProducts);
        }
    }
    const orderbyColor = (color: string) => {

        var sortedProducts = products.filter(prod => prod.colors === color)

        if (!sortedProducts) {
            console.log("Product Not found")
        }
        else {
            console.log("product Founded : ", sortedProducts);
            setProducts(sortedProducts);
        }
    }

    return (
        <div className="dashboard-container">
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <section className="section add-trending-product">
                <h2>Trending Products</h2>
                <div>
                    {
                        products.length !== 0 ? products.map((prod, index) => {
                            if (prod.trendingProd) {
                                return <div key={prod} style={{ border: '1px solid gray', borderRadius: '8px', margin: '5px', padding: '5px', display: 'flex', alignItems: 'center', width: '100%', maxHeight: '150px', overflow: "hidden" }}>
                                    <div style={{ width: '30%', overflow: "hidden" }}>
                                        <img style={{ width: '50%' }} src={`${prod.image}`} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                        {/* <h3>{(index + 1) + '. '}</h3> */}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <h3 style={{ marginRight: '10px' }}>{prod.name}</h3>
                                            <p style={{ marginRight: '10px' }}>| {prod.price + ' RS'} |</p>
                                            <p>{prod.material} |</p>
                                            <p>{prod.colors} | </p>
                                        </div>
                                    </div>
                                </div>
                            }
                        })
                            :
                            <div>
                                <p style={{ textAlign: 'center' }}>--- No products to show ---</p>
                            </div>
                    }
                </div>
            </section>
            <div className="dashboard-sections">
                <section className="section add-trending-product" style={{ width: '100%' }}>
                    <h2>Filter</h2>
                    <p>Materials</p>
                    <div>
                        {
                            materials.length !== 0 ? materials.map((mat) => {
                                return <div key={mat}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <li onClick={() => orderbyMaterial(mat)}>
                                            {mat} : {fetchCountforFiltersbyMaterial(mat)}
                                        </li>
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
                                        <li>{size} : {fetchCountforFiltersbySize(size)}</li>
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
                                        <li onClick={() => orderbyPrice(price)}>
                                            {price} : {fetchCountforFiltersbyPrice(price)}
                                        </li>
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
                                        <li onClick={() => { orderbyColor(color) }}>{color} : {fetchCountforFiltersbyColor(color)} </li>
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
                    <div>
                        {
                            products.length !== 0 ? products.map((prod, index) => {
                                return <div key={prod} style={{ border: '1px solid gray', borderRadius: '8px', margin: '5px', padding: '5px', display: 'flex', alignItems: 'center', width: '100%', maxHeight: '150px', overflow: "hidden" }}>
                                    <div style={{ width: '30%', overflow: "hidden" }}>
                                        <img style={{ width: '100%', height: '100%' }} src={`${prod.image}`} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                        <h3>{(index + 1) + '. '}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <h3 style={{ marginRight: '10px' }}>{prod.name}</h3>
                                            <p style={{ marginRight: '10px' }}>| {prod.price + ' RS'} |</p>
                                            <p>{prod.material} |</p>
                                            <p>{prod.colors}</p>
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