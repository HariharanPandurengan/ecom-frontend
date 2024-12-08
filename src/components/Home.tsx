import axios from "axios";
import React, { useState, useEffect } from "react";
import "../App.css";

const Home: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentFilters, setCurrentFilters] = useState<Record<string, Record<string, boolean>>>({});
    const filterMet = [
        {
            title:'material',
            list:['cotton', 'cylon', 'rexin']
        },
        {
            title:'price',
            list:['0-500','501-1000', '1001-2000', '2001-3000', '3000<']
        },
        {
            title:'colors',
            list:["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Purple", "Orange", "Brown", "Grey", "Navy", "Teal", "Maroon"]
        },
        {
            title:'sizes',
            list:['S', 'M', 'L', 'XL']
        }
    ]
    
    useEffect(() => {
        fetchProducts()
        const initialState: Record<string, Record<string, boolean>> = {}
        for(let i=0;i<filterMet.length;i++){
            const title = filterMet[i]['title']; 
            initialState[title] = {}; 
            for (let j = 0; j < filterMet[i]['list'].length; j++) {
                const listItem = filterMet[i]['list'][j];
                initialState[title][listItem] = false;
            }
        }
        setCurrentFilters(initialState)
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
    const fetchCount = (title:string,subCat:string) => {
        if(title == 'material'){
            const filtered = products.filter(items => {
                return items[title].toLowerCase() == subCat.toLowerCase();
            })
            return filtered.length
        }
        else if(title == 'price'){
            let priceLimit:any = [];
            if(subCat.includes('-')){
                priceLimit = subCat.split('-')  
                const filtered = products.filter(items => {
                    return (Number(items[title]) >= Number(priceLimit[0])) && (Number(items[title]) <= Number(priceLimit[1]))
                })
                return filtered.length
            }
            else{
                const filtered = products.filter(items => {
                    return Number(items[title]) > Number(subCat.slice(0,-1))
                })
                return filtered.length
            }
        }
        else if(title == 'sizes'){
            let count = 0;
            products.filter(items => {
                for (const key in items['sizes']) {
                    for(const key2 in items['sizes'][key]){
                        if(key2 === subCat){
                            count = count + Number(items['sizes'][key][key2])
                        }
                    }
                }
            })
            return count
        }
        else if(title == 'colors'){
            let count = 0;
            products.filter(items => {
                for (const key in items['sizes']) {
                    if(key === subCat){
                        for(const key2 in items['sizes'][key]){
                            count = count + Number(items['sizes'][key][key2])
                        }
                    }
                }
            })
            return count
        }
    }

    const ChangeCurrentFilters = (e:any,title:string,subCat:string) => {
        e.preventDefault();
        setCurrentFilters(prevData => ({
            ...prevData,
            [title] : {
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

        for(let key in currentFilters){
            for(let key2 in currentFilters[key]){
                if(currentFilters[key][key2] === true && AllFalse === true){
                    AllFalse = false
                }
                if(currentFilters[key][key2] === true){
                    if(key === 'material'){
                        material = true;
                    }
                    if(key === 'price'){
                        price = true;
                    }
                    if(key === 'colors'){
                        colors = true;
                        whichColor = key2
                    }
                }
            }
        }
        
        if(AllFalse === true){
            setFilteredProducts(products)
        }
        else{
            const filteredOne = [];
            for(let key in currentFilters){
                for(let key2 in currentFilters[key]){
                    if(currentFilters[key][key2] === true){
                        if (key === 'material') {
                            for(let i=0;i<products.length;i++){
                                if(products[i]['material'] === key2){
                                    filteredOne.push(products[i])
                                }
                            }
                        } 
                        else if (key === 'price') {
                            let priceLimit:any = [];
                            if(key2.includes('-')){
                                priceLimit = key2.split('-')  
                                if(!material){
                                    for(let i=0;i<products.length;i++){
                                        if(Number(products[i]['price']) >= Number(priceLimit[0]) && Number(products[i]['price']) <= Number(priceLimit[1])){
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === products[i]['_id']
                                            })
                                            if(alreadyExist.length === 0){
                                                filteredOne.push(products[i])
                                            }
                                        }
                                    }
                                }
                                else if(material && filteredOne.length !== 0){
                                    for(let i=0;i<filteredOne.length;i++){
                                        if(!(Number((filteredOne[i]['price']) >= Number(priceLimit[0])) && Number(products[i]['price']) <= Number(priceLimit[1]))){
                                            filteredOne.splice(i, 1);
                                        }  
                                    }
                                }
                            }
                            else{
                                if(!material){
                                    for(let i=0;i<products.length;i++){
                                        if(Number(products[i]['price']) > Number(key2.slice(0,-1))){
                                            const alreadyExist = filteredOne.filter(list => {
                                                return list._id === products[i]['_id']
                                            })
                                            if(alreadyExist.length === 0){
                                                filteredOne.push(products[i])
                                            }
                                        }
                                    }
                                }
                                else if(material && filteredOne.length !== 0){
                                    for(let i=0;i<filteredOne.length;i++){
                                        if((Number(products[i]['price']) > Number(key2.slice(0,-1))) === false){
                                            filteredOne.splice(i, 1);
                                        }  
                                    }
                                }
                            }
                        } 
                        else if (key === 'colors') {
                            if((material || price) && filteredOne.length !== 0){
                                for (let i = 0;i < filteredOne.length; i++) {
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
                            else{
                                for(let i=0;i<products.length;i++){
                                    const Colorkeys = Object.keys(products[i]['sizes']); 
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        const currentColorsArray = Object.values(products[i]['sizes'][Colorkeys[j]]);
                                        if (key2.toLocaleLowerCase() === Colorkeys[j].toLocaleLowerCase()) {
                                            for (let cc = 0; cc < currentColorsArray.length; cc++) {
                                                const total = currentColorsArray.reduce((sum, num) => sum + Number(num), 0);
                                                if(total !== 0){
                                                    filteredOne.push(products[i])
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } 
                        else if (key === 'sizes') {
                            if((colors || price || material)  && filteredOne.length !== 0){
                                for (let i = 0;i < filteredOne.length; i++) {
                                    let thisSizeTotalCount = 0;
                                    const Colorkeys = Object.keys(filteredOne[i]['sizes']); 
                                    for (let j = 0; j < Colorkeys.length; j++) {
                                        if(!colors){
                                            const currentSizesArray = Object.keys(filteredOne[i]['sizes'][Colorkeys[j]]);
                                            const currentSizesValueArray = Object.values(filteredOne[i]['sizes'][Colorkeys[j]]);
                                            for (let cc = 0; cc < currentSizesArray.length; cc++) {
                                                if (key2.toLocaleLowerCase() === currentSizesArray[cc].toLocaleLowerCase()) {
                                                    thisSizeTotalCount += currentSizesValueArray[cc]
                                                }
                                            }
                                        }
                                        else{
                                            if(whichColor === Colorkeys[j]){
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
                            else{
                                for(let i=0;i<products.length;i++){
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
                                    if(thisSizeTotalCount !== 0){
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
    },[currentFilters])

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
                    {
                        filterMet.map(item => {
                           return   <div key={item.title}>
                                        <p style={{marginBottom:'2px'}}><strong>{item.title} :</strong></p>
                                        <ul style={{marginTop:'0'}}>
                                            {
                                               item.list.map(list => {
                                                    return <li key={list} value={list} style={{backgroundColor:`${currentFilters[item.title]?.[list] ? '#D3D3D3' : ''}`,paddingLeft:`${currentFilters[item.title]?.[list] ? '5px' : ''}`}} onClick={e => ChangeCurrentFilters(e,item.title,list)}>{list}{' : '+fetchCount(item.title,list)}</li>
                                               }) 
                                            }
                                        </ul>
                                    </div>
                        })
                    }
                </section>
                <section className="section add-trending-product" style={{ width: '96%' }}>
                    <h2>Products</h2>
                    <div>
                        {
                            filteredProducts.length !== 0 ? filteredProducts.map((prod, index) => {
                                return <div key={prod} style={{ border: '1px solid gray', borderRadius: '8px', margin: '5px', padding: '5px', display: 'flex', alignItems: 'center', width: '100%', maxHeight: '150px', overflow: "hidden" }}>
                                    <div style={{ width: '30%', overflow: "hidden" }}>
                                        <img style={{ width: '100%', height: '100%' }} src={`${Object.values(prod.images)[0]}`} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                        <h3>{(index + 1) + '. '}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <h3 style={{ marginRight: '10px' }}>{prod.name}</h3>
                                            <p style={{ marginRight: '10px' }}>| {prod.price + ' RS'} |</p>
                                            <p style={{ marginRight: '10px' }}>{prod.material} |</p>
                                            <p>( {
                                                prod.colors.map((list,index)=>{
                                                    if(index == prod.colors.length-1){
                                                        return list
                                                    }
                                                    else{
                                                        return list+' | '
                                                    }
                                                })
                                            } )</p>
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