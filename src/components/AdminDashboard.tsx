import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "../App.css";
import axios from 'axios';
import Header from "./Header,Footer/Header";
import Footer from "./Header,Footer/Footer";
import { useNavigate } from "react-router-dom";

interface SizesOptions { 
    [key: string]: { [key: string]: string }; 
}

type ColorImages = Array<File | string>; // File for newly added, string for already-saved URLs

interface ImagesMap {
  [color: string]: ColorImages;
}

interface Product {
  // ...keep everything else the same
  images: ImagesMap;   // was: {[key: string]: File}
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
  images: ImagesMap;
  fits: string,
  sleeves: string,
  occasion: string,
  pattern:  string,
  trendingProd: boolean;
}

const initialProductState = { 
    name: '', 
    price: '', 
    sex: '',
    category: '', 
    subCategory: '', 
    material: '', 
    totalQuantity: '', 
    description: '', 
    colors: [] as string[], 
    sizes: {}, 
    images: {}, 
    fits: '',
    sleeves: '',
    occasion: '',
    pattern:  '',
    trendingProd: false,
};

const AdminDashboard: React.FC = () => {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [editProdID,setEditProdID] = useState('')
    const [delProdID,setDelProdID] = useState('')
    const [delProdName,setDelProdName] = useState('')
    const [products, setProducts] = useState([]);
    const [editP,setEditP] = useState(false)
    const [deleteP,setDeleteP] = useState(false)
    const sizes = ['select','S', 'M', 'L', 'XL'];
    const navigate = useNavigate()
    const fields = [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'price', label: 'Product Price', type: 'text' },
        { name: 'sex', label: 'Sex', type: 'select', options: ['select','Male',
            'Female',
            'Unisex'] , multiple: false},
        { name: 'category', label: 'Product Category', type: 'select', options: ['select', 'Shirts', 'T-Shirts', 'Trousers', 'Pants'], multiple: false },
        { name: 'subCategory', label: 'Product Sub Category', type: 'text' },
        { name: 'material', label: 'Product Material', type: 'select',options:[ 'select','Cotton',
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
            'Acrylic Blend'] },
        { name: 'fits', label: 'Fit', type: 'select',options: ['select','Baggy Fit',
            'Boot cut',
            'Box Fit',
            'Comfort Fit',
            'Loose Fit',
            'Oversized Fit',
            'Regular Fit',
            'Relaxed Fit',
            'Skinny Fit',
            'Slim Fit'] , multiple: false},
        { name: 'sleeves', label: 'Sleeves', type: 'select',options: ['select','Elbow Sleeve',
            'Full Sleeve',
            'Half Sleeve'], multiple: false },
        { name: 'occasion', label: 'Occasion', type: 'select',options: ['select',"Casual Wear",
            "Formal Wear",
            "Festive Wear",
            "College Wear",
            "Street Wear"], multiple: false },
        { name: 'pattern', label: 'Pattern', type: 'select',options: ['select',"Checks",
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
            "Floral"] , multiple: false },
        { name: 'totalQuantity', label: 'Product Total Quantity', type: 'text' },
        { name: 'description', label: 'Product Description', type: 'textarea' },
        { name: 'colors', label: 'Colors Available', type: 'select', options: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"], multiple: true },
    ];

    useEffect(()=>{
        if(localStorage.getItem('AdminLogin') === 'true'){
            fetchProducts()
        }
        else{
            navigate('/AdminLogin')
        }
    },[])

    const header = {
        headers: {
            username: localStorage.getItem('username'),
            authToken: localStorage.getItem('authToken')
        }
    }

    const fetchProducts = () => {
        axios.get(`${import.meta.env.VITE_REACT_API_URL}getProducts`,header)
        .then(res=>{
            if(res.data.status === true){
                setProducts(res.data.products);
            }
            if(res.data.message && res.data.message == "Unauthorized"){
                localStorage.setItem('AdminLogin','false')
                localStorage.setItem('username',"")
                localStorage.setItem('authToken',"")
                navigate("/AdminLogin")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(value != 'select'){
            setProduct(prevState => ({
            ...prevState,
            [name]: value
            }));
        }
    };

    function editProd(e_id: any){
        setProduct(initialProductState)
        const prod = products.filter(list=>list._id == e_id)
        setProduct(prod[0])
    }

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

    


// Create a preview src for either a new File or an existing URL string
const getPreviewSrc = (img: File | string) =>
  img instanceof File ? URL.createObjectURL(img) : img;

// Append files to a specific color’s images[]
const addImagesForColor = (color: string, files: File[]) => {
  setProduct(prev => {
    const existing = (prev.images?.[color] ?? []) as (File | string)[];
    return {
      ...prev,
      images: {
        ...prev.images,
        [color]: [...existing, ...files],
      },
    };
  });
};

// Remove one image by index inside a color bucket
const removeImage = (color: string, index: number) => {
  setProduct(prev => {
    const list = [...(prev.images?.[color] ?? [])];
    list.splice(index, 1);
    return {
      ...prev,
      images: { ...prev.images, [color]: list },
    };
  });
};

const handleFileChange2 = (e: ChangeEvent<HTMLInputElement>, color: string) => {
  if (!e.target.files) return;
  const files = Array.from(e.target.files);
  addImagesForColor(color, files);
};




    const handleMultiSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const selectedValue = Array.from(options).find(option => option.selected)?.value;

        if (selectedValue && selectedValue !== 'select' && !product[name].includes(selectedValue)) {
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
        if(size != 'select'){
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

    const addProduct = async (e: FormEvent<HTMLFormElement>, type: string) => {
  e.preventDefault();

  // ---- keep your original empty-field check logic, just reused here ----
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

  if (emptyField !== '') {
    alert(`${emptyField} field is empty`);
    return;
  }
  // ----------------------------------------------------------------------

  // Build FormData
  const formData = new FormData();

  // Do NOT include images inside the JSON body
  const productCopy: any = { ...product };
  delete productCopy.images;
  formData.append('product', JSON.stringify(productCopy));

  // Append all images as arrays per color: images[Color][]
  Object.entries(product.images || {}).forEach(([color, arr]) => {
    console.log(arr)
    (arr || []).forEach(item => {
      if (item instanceof File) {
        formData.append(`images[${color}][]`, item);
      }
    });
  });

  // Endpoint resolution (same as your code)
  let link = '';
  if (type === 'add') {
    link = `${import.meta.env.VITE_REACT_API_URL}addProduct`;
  } else if (type === 'edit') {
    link = `${import.meta.env.VITE_REACT_API_URL}editProduct`;
    formData.append('id', editProdID);
  }

  try {
    console.log(formData)
    const res = await axios.post(link, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        username: localStorage.getItem('username'),
        authToken: localStorage.getItem('authToken'),
      },
    });

    if (res?.data?.message === 'Unauthorized') {
      localStorage.setItem('AdminLogin', 'false');
      localStorage.setItem('username', '');
      localStorage.setItem('authToken', '');
      navigate('/AdminLogin');
      return;
    }

    if (res?.data?.status === true) {
      setProduct(initialProductState);
      fetchProducts();
      if (type === 'add') {
        alert('Product Added');
      } else if (type === 'edit') {
        setEditP(false);
        alert('Product Updated');
      }
    } else {
      alert('Network issue. Product not added');
    }
  } catch (err) {
    console.log(err);
  }
};

    const handleChangeTrend = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let newValue: any = value;
        if (type === "radio") {
            newValue = value === "true"; // Convert string to boolean
        }
    
        setProduct(prev => ({
            ...prev,
            [name]: newValue
        }));
    };
    
    async function deleteProd(e){
        e.preventDefault();
        await axios.post(`${import.meta.env.VITE_REACT_API_URL}deleteProduct`,{product:product,id:delProdID},header)
        .then(res=>{
            if(res.data.message && res.data.message == "Unauthorized"){
                localStorage.setItem('AdminLogin','false')
                localStorage.setItem('username',"")
                localStorage.setItem('authToken',"")
                navigate("/AdminLogin")
            }
            if(res.data.status === true){
                fetchProducts()
                setDeleteP(false)
            }
            else{
                alert('Network issuse.product not added')
            }
            fetchProducts()
        })
        .catch(err=>{
            console.log(err)
        })
    }

  return (
  <div>
    <Header/>
    <div className="dashboard-container mt-20">
      <div className="dashboard-sections">
        <section className="section add-product">
          <h2 className="font-bold">Add Product</h2>
          <form onSubmit={(e)=>addProduct(e,'add')}>
            {fields.map((field) => (
              <div key={field.name} className="form-group">
                <label className="underline" htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea className="border" id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                ) : field.type === 'file' ? (
                  <input required type={field.type} id={field.name} name={field.name} onChange={handleFileChange} />
                ) : field.type === 'select' ? (
                  <div key={field.name}>
                    <select className="border mb-2" required id={field.name} name={field.name} multiple={field.multiple} value={product[field.name as keyof Product] as string[]} onChange={field.multiple ? handleMultiSelectChange : handleChange}>
                      {field.options && field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {field.multiple &&
                      <div key={field.name} style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', border: '1px solid gray', padding: '10px' }}>
                        {product[field.name].map((selectOpt: string) => (
                          <div style={{ marginLeft: '5px', paddingLeft: '10px', paddingRight: '15px', border: '1px solid black', position: 'relative' }} key={selectOpt}>
                            <p style={{ marginBottom: '5px' }}>{selectOpt}</p>
                            <small onClick={() => handleMultiSelectRemove(field.name as keyof Product, selectOpt)} className="py-0 px-1.5 pb-0.5 " style={{ position: 'absolute', top: '-30%', right: '-10%', borderRadius: '50%', color: 'white', background: 'red', cursor: 'pointer' }}>x</small>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                ) : (
                  <input type={field.type} id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                )}
              </div>
            ))}

            {/** Sizes per color (unchanged) */}
            {product.colors.length !== 0 && 
              <div>
                <h3 style={{marginBottom:'0px'}}>Select colors and quantity for sizes availabe</h3>
                {product.colors.map(item => {
                  return (
                    <div key={item} style={{border:'1px solid gray',boxShadow:'0px 0px 1px 1px',margin:'5px',padding:'5px'}}>
                      <div className="mb-3" style={{display:'flex',alignItems:'center'}}>
                        <p style={{marginRight:'10px'}} className="underline">{item}</p>
                        <select className="border" onChange={(e) => sizeSelect(e,item)}>
                          {sizes.map(size => (
                            <option key={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        {product.sizes[item] && Object.keys(product.sizes[item]).map(size => {
                          return (
                            <div key={size} className="mb-3" style={{display:'flex',alignItems:'center'}}>
                              <p style={{marginRight:'10px'}}>{size}</p>
                              <input required type="text" placeholder="Enter Quantity" className="border" value={product.sizes[item][size]} onChange={(e) => changeQuantityOfColorOfSize(e,item,size)}/>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            }

            {/** ——— CHANGED: multiple images per color + previews + remove ——— */}
            {product.colors.length !== 0 && 
              <div>
                <h3 style={{marginBottom:'0px'}}>Select images for colors you selected</h3>
                {product.colors.map(item => {
                  return (
                    <div key={item} style={{border:'1px solid gray',boxShadow:'0 0 1px 1px',margin:'5px',padding:'5px'}}>
                      <p style={{marginRight:'10px'}}>{item}</p>

                      {/* multiple file input per color */}
                      <input
                        required
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange2(e,item)}
                      />

                      {/* previews */}
                      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:10}}>
                        { item && product.images?.hasOwnProperty(item) && (product.images[item] ?? []).map((img: any, idx: number) => (
                          <div key={idx} style={{position:'relative', width:90, height:90, overflow:'hidden', border:'1px solid #ccc'}}>
                            <img
                              src={getPreviewSrc(img)}
                              style={{width:'100%', height:'100%', objectFit:'cover'}}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(item, idx)}
                              style={{position:'absolute', top:2, right:2, background:'red', color:'#fff', border:'none', borderRadius:'50%', width:22, height:22, lineHeight:'20px', cursor:'pointer'}}
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            }
            {/** ——— END CHANGED ——— */}

            <div className="form-group">
              <label className="underline">Is this a trending product?</label>
              <div>
                <label>
                  <input type="radio" name="trendingProd" value="true" checked={product.trendingProd === true} onChange={(e) => handleChangeTrend(e)} /> Yes
                </label>
              </div>
            </div>

            <button type="submit">Add Product</button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/Adminorderdashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Admin Dashboard
          </button>
        </section>

        <section className="section add-trending-product">
          <h2 className="font-bold text-center">Products </h2>
          <div>
            {products.length !== 0 ? products.map((prod:any,index:number) => {
              return (
                <div key={prod} className="relative" style={{border:'1px solid gray',margin:'5px',padding:'5px',display:'flex',alignItems:'center',width:'100%',maxHeight:'350px',overflow:"hidden"}}>
                  <h3>{(index+1)+'. '}</h3>

                  {/* ——— CHANGED: compute firstSrc safely ——— */}
                  <div style={{width:'30%',overflow:"hidden"}}>
                    {(() => {
                      const firstColorImages = prod.images && (Object.values(prod.images)[0] as any[] | undefined);
                      const firstImg = firstColorImages && firstColorImages[0];
                      const firstSrc = firstImg instanceof File ? URL.createObjectURL(firstImg) : (firstImg || "");
                      return <img style={{width:'100%'}} src={firstSrc} />;
                    })()}
                  </div>
                  {/* ——— END CHANGED ——— */}

                  <div style={{display:'flex',alignItems:'center',marginLeft:'10px'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <dl>
                        <div style={{ display: 'flex' }}>
                          <dt style={{ fontWeight: 'bold', minWidth: 130 }}>Name:</dt>
                          <dd>{prod.name}</dd>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <dt style={{ fontWeight: 'bold', minWidth: 130 }}>Price:</dt>
                          <dd style={{ color: 'red' }}>{'₹' + prod.price}</dd>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <dt style={{ fontWeight: 'bold', minWidth: 130 }}>Material:</dt>
                          <dd>{prod.material}</dd>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <dt style={{ fontWeight: 'bold', minWidth: 130 }}>Colors Available:</dt>
                          <dd>{prod.colors.join(', ')}</dd>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <dt style={{ fontWeight: 'bold', minWidth: 130 }}>Total Quantity:</dt>
                          <dd>{prod.totalQuantity}</dd>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontWeight: 'bold', minWidth: 130 }}>Sizes Available:</span>
                          <span>
                            {Object.entries(prod.sizes).map(([color, sizeObj]: any) => (
                              <div key={color}>
                                <span style={{ fontWeight: 'bold' }}>{color}:</span>{' '}
                                {Object.entries(sizeObj).map(([size, qty]: any, idx: number, arr: any[]) => (
                                  <span key={size}>
                                    {size} : {qty}{idx < arr.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </span>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="absolute top-0 right-1 w-[10%] h-[100%] flex items-center justify-between">
                    <button className="w-[45%] h-auto b-e" onClick={()=>{setEditP(true);setEditProdID(prod._id);editProd(prod._id)}}>Edit</button>
                    <button className="w-[45%] h-auto bg-red-500 b-d" onClick={()=>{setDeleteP(true);setDelProdID(prod._id);setDelProdName(prod.name)}}>Delete</button>
                  </div>
                </div>
              )
            })
            :
            <div>
              <p style={{textAlign:'center'}}>--- No products to show ---</p>
            </div>
            }
          </div>
        </section>
        {/* <section className="section add-trending-product">
            <h2>Add Trending Product</h2>
        </section> */}
        {/* <section className="section customer-list">
            <h2>Customer List</h2>
        </section> */}
      </div>
    </div>

    <Footer></Footer>

    {editP && 
      <div className="fixed top-0 bottom-0 w-full bgTrans flex justify-center">
        <div className="w-[80%] h-[500px] overflow-y-auto mt-5 bg-white relative rounded p-2">
          <h2 className="font-bold underline">Edit Product:</h2>
          <form onSubmit={(e)=>addProduct(e,'edit')}>
            {fields.map((field) => (
              <div key={field.name} className="form-group">
                <label className="underline" htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea className="border" id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                ) : field.type === 'file' ? (
                  <input required type={field.type} id={field.name} name={field.name} onChange={handleFileChange} />
                ) : field.type === 'select' ? (
                  <div key={field.name}>
                    <select className="border mb-2" required id={field.name} name={field.name} multiple={field.multiple} value={product[field.name as keyof Product] as string[]} onChange={field.multiple ? handleMultiSelectChange : handleChange}>
                      {field.options && field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {field.multiple &&
                      <div key={field.name} style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', border: '1px solid gray', padding: '10px' }}>
                        {product[field.name].map((selectOpt: string) => (
                          <div style={{ marginLeft: '5px', paddingLeft: '10px', paddingRight: '15px', border: '1px solid black', position: 'relative' }} key={selectOpt}>
                            <p style={{ marginBottom: '5px' }}>{selectOpt}</p>
                            <small onClick={() => handleMultiSelectRemove(field.name as keyof Product, selectOpt)} className="py-0 px-1.5 pb-0.5 " style={{ position: 'absolute', top: '-30%', right: '-10%', borderRadius: '50%', color: 'white', background: 'red', cursor: 'pointer' }}>x</small>
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                ) : (
                  <input type={field.type} id={field.name} name={field.name} value={product[field.name as keyof Product] as string} onChange={handleChange} />
                )}
              </div>
            ))}

            {product.colors.length !== 0 && 
              <div>
                <h3 style={{marginBottom:'0px'}}>Select images for colors you selected</h3>
                {product.colors.map(item => {
                  return (
                    <div key={item} style={{border:'1px solid gray',boxShadow:'0px 0px 1px 1px',margin:'5px',padding:'5px'}}>
                      <p style={{marginRight:'10px'}}>{item}</p>
                      {/* keep Edit modal simple: one input, and show current thumbs */}
                      <div className="flex items-center">
                        <input type="file" multiple onChange={(e) => handleFileChange2(e,item)}/>
                        <div className="h-[200px] flex items-center ms-2">
                          <p>Current Images :</p>
                        </div>
                      </div>

                      {/* previews grid in edit modal too */}
                      <div style={{display:'flex', gap:10, flexWrap:'wrap', marginTop:10}}>
                        {item && product.images?.hasOwnProperty(item) && (product.images[item] ?? []).map((img: any, idx: number) => (
                          <div key={idx} style={{position:'relative', width:90, height:90, overflow:'hidden', border:'1px solid #ccc'}}>
                            <img src={getPreviewSrc(img)} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            <button
                              type="button"
                              onClick={() => removeImage(item, idx)}
                              style={{position:'absolute', top:2, right:2, background:'red', color:'#fff', border:'none', borderRadius:'50%', width:22, height:22, lineHeight:'20px', cursor:'pointer'}}
                              aria-label="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            }

            <button type="submit" className="font-bold">Save</button>
          </form>
          <button className="absolute top-2 right-2 bg-red-500 w-[27px] hover:bg-red-700 p-0 pb-1 rounded-full" onClick={()=>setEditP(false)}>x</button>
        </div>
      </div>
    }

    {deleteP && 
      <div className="fixed top-0 bottom-0 w-full bgTrans flex justify-center items-center">
        <div className="text-center w-[80%] h-[120px] overflow-y-auto mt-5 bg-white relative rounded p-2">
          <h2 className="font-bold">Warning</h2>
          <p>This will delete product : '{delProdName}'</p>
          <div className="w-[50%] m-auto flex items-center justify-between mt-3">
            <button className="w-[45%] h-[30px] b-e" onClick={()=>{setDeleteP(false)}}>Cancel</button>
            <button className="w-[45%] h-[30px] bg-red-500 b-d" onClick={(e)=>{deleteProd(e);}}>Delete</button>
          </div>
        </div>
      </div>
    }
  </div>
);

}

export default AdminDashboard;
