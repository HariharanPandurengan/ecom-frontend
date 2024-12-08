import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "../App.css";
import axios from 'axios';

interface SizesOptions { 
    [key: string]: { [key: string]: string }; 
}

interface Image { 
    [key: string]:  string ; 
}

const initialProductState = { 
    name: '', 
    price: '', 
    category: '', 
    subCategory: '', 
    material: '', 
    totalQuantity: '', 
    description: '', 
    colors: [] as string[], 
    sizes: {}, 
    images: {}, 
    trendingProd: false,
};

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

const AdminDashboard: React.FC = () => {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [products, setProducts] = useState([]);
    const sizes = ['S', 'M', 'L', 'XL'];
    const fields = [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'price', label: 'Product Price', type: 'text' },
        { name: 'category', label: 'Product Category', type: 'text' },
        { name: 'subCategory', label: 'Product Sub Category', type: 'text' },
        { name: 'material', label: 'Product Material', type: 'text' },
        { name: 'totalQuantity', label: 'Product Total Quantity', type: 'text' },
        { name: 'description', label: 'Product Description', type: 'textarea' },
        { name: 'colors', label: 'Colors Available', type: 'select', options: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"], multiple: true },
    ];

    useEffect(()=>{
        fetchProducts()
    },[])

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`)
        .then(res=>{
            if(res.data.status === true){
                setProducts(res.data.products);
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>,color:any) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct(prevState => ({
                ...prevState,
                images: {
                    ...prevState.images,
                    [color]: reader.result as string
                } 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMultiSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const selectedValue = Array.from(options).find(option => option.selected)?.value;

        if (selectedValue && !product[name].includes(selectedValue)) {
        setProduct(prevState => ({
            ...prevState,
            [name]: [...(prevState[name as keyof Product] as string[]), selectedValue]
        }));
        }
    };

    const handleMultiSelectRemove = (name: keyof Product, option: string) => {
        setProduct(prevState => ({
        ...prevState,
        [name]: (prevState[name] as string[]).filter((v: string) => v !== option)
        }));
    };

    const sizeSelect = (e: ChangeEvent<HTMLSelectElement>,color: string) => {
        const size = e.target.value;

        setProduct(prevState => ({
            ...prevState,
            sizes: {
                ...prevState.sizes,
                [color]: {
                    ...(prevState.sizes[color] || {}), 
                    [size]: '0' 
                }
            }
        }))
    }

    const changeQuantityOfColorOfSize = (e: any,color: string,size: string) => {
        const sizeCount = e.target.value;
        setProduct(prevState => ({
            ...prevState,
            sizes: {
                ...prevState.sizes,
                [color]: {
                    ...(prevState.sizes[color] || {}), 
                    [size]: sizeCount 
                }
            }
        }))
    }

    const addProduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let emptyField = '';
        Object.keys(product).map(val => {
        const key = val as keyof Product;
        if (Array.isArray(product[key])) {
            if (product[key] == null || (product[key] as string[]).length === 0) {
            emptyField = val;
            }
        } else {
            if (product[key] === '' || product[key] == null) {
            emptyField = val;
            }
        }
        });
        if (emptyField === '') {
            await axios.post(`${import.meta.env.VITE_REACT_API_URL}addProduct`,{product:product})
            .then(res=>{
                if(res.data.status === true){
                    setProduct(initialProductState);
                    fetchProducts()
                    alert('Product Added')
                }
                else{
                    alert('Network issuse.product not added')
                }
            })
            .catch(err=>{
                console.log(err)
            })
        } 
        else {
        alert(`${emptyField} field is empty`);
        }
    };

  return (
    <div className="dashboard-container">
        <div className="search-bar">
            <input type="text" placeholder="Search..." />
        </div>
        <div className="dashboard-sections">
            <section className="section add-product">
                <h2>Add Product</h2>
                <form onSubmit={addProduct}>
                    {fields.map((field) => (
                        <div key={field.name} className="form-group">
                            <label htmlFor={field.name}>{field.label}</label>
                            {field.type === 'textarea' ? (
                            <textarea id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                            ) : field.type === 'file' ? (
                            <input type={field.type} id={field.name} name={field.name} onChange={handleFileChange} />
                            ) : field.type === 'select' ? (
                            <div key={field.name}>
                                <select id={field.name} name={field.name} multiple={field.multiple} value={product[field.name as keyof Product] as string[]} onChange={field.multiple ? handleMultiSelectChange : handleChange}>
                                {field.options && field.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                </select>
                                <div key={field.name} style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', border: '1px solid gray', padding: '10px' }}>
                                {product[field.name].map((selectOpt: string) => (
                                    <div style={{ marginLeft: '5px', paddingLeft: '10px', paddingRight: '10px', border: '1px solid black', position: 'relative' }} key={selectOpt}>
                                    <p style={{ marginBottom: '5px' }}>{selectOpt}</p>
                                    <small onClick={() => handleMultiSelectRemove(field.name as keyof Product, selectOpt)} style={{ position: 'absolute', top: '1px', right: '1px', paddingLeft: '4px', paddingRight: '5px', borderRadius: '50%', color: 'white', background: 'red', cursor: 'pointer' }}>x</small>
                                    </div>
                                ))}
                                </div>
                            </div>
                            ) : (
                            <input type={field.type} id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                            )}
                        </div>
                    ))}
                    {
                        product.colors.length !== 0 && 
                                                    <div>
                                                        <h3 style={{marginBottom:'0px'}}>Select colors and quantity for sizes availabe</h3>
                                                        {
                                                            product.colors.map(item => {
                                                                return  <div key={item} style={{border:'1px solid gray',boxShadow:'0px 0px 1px 1px',margin:'5px',padding:'5px'}}>
                                                                            <div style={{display:'flex',alignItems:'center'}}>
                                                                                <p style={{marginRight:'10px'}}>{item}</p>
                                                                                <select onChange={(e) => sizeSelect(e,item)}>
                                                                                    {
                                                                                        sizes.map(size => {
                                                                                            return  <option key={size}>{size}</option>
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    product.sizes[item] && Object.keys(product.sizes[item]).map(size => {
                                                                                        return  <div key={size} style={{display:'flex',alignItems:'center'}}>
                                                                                                    <p style={{marginRight:'10px'}}>{size}</p>
                                                                                                    <input type="text" placeholder="Enter Quantity" value={product.sizes[item][size]} onChange={(e) => changeQuantityOfColorOfSize(e,item,size)}/>
                                                                                                </div>
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>
                                                            })
                                                        }
                                                    </div>
                    }
                    {
                        product.colors.length !== 0 && 
                        <div>
                            <h3 style={{marginBottom:'0px'}}>Select images for colors you selected</h3>
                            {
                                product.colors.map(item => {
                                    return  <div key={item} style={{border:'1px solid gray',boxShadow:'0px 0px 1px 1px',margin:'5px',padding:'5px'}}>
                                                <p style={{marginRight:'10px'}}>{item}</p>
                                                <input type="file" onChange={(e) => handleFileChange(e,item)}/>
                                            </div>
                                })
                            }
                        </div>
                    }
                    <button type="submit">Add Product</button>
                </form>
            </section>
            <section className="section add-trending-product">
                <h2>Products</h2>
                <div>
                    {
                        products.length !== 0 ? products.map((prod,index) => {
                                                    return  <div key={prod} style={{border:'1px solid gray',margin:'5px',padding:'5px',display:'flex',alignItems:'center',width:'100%',maxHeight:'150px',overflow:"hidden"}}>
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
            </section>
            <section className="section add-trending-product">
                <h2>Add Trending Product</h2>
            </section>
            {/* <section className="section customer-list">
                <h2>Customer List</h2>
            </section> */}
        </div>
    </div>
  );
}

export default AdminDashboard;