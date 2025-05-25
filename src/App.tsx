import { Route, Routes } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ProductCard from './components/ProductCard'
import Home from './components/Home'
import CheckoutPage from './components/CheckoutPage'
import CustomerLogin from './components/CustomerLogin'


const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path='*' element={<PageNotFound />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/AdminDashboard' element={<AdminDashboard />}></Route>
        <Route path='/Home' element={<Home />}></Route>
        <Route path='/ProductCard' element={<ProductCard />}></Route>
        <Route path='/CheckoutPage' element={<CheckoutPage />}></Route>
        <Route path='/CustomerLogin' element={<CustomerLogin/>}></Route>
      </Routes>
    </>
  )
}

export default App
