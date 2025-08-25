import { Route, Routes } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import AdminDashboard from './components/AdminDashboard'
import ProductCard from './components/ProductCard'
import Home from './components/Home'
import CheckoutPage from './components/CheckoutPage'
import CustomerLogin from './components/CustomerLogin'
import AdminLogin from './components/AdminLogin'
import OrderList from './components/OrderList'
import AdminOrderDashboard from './components/AdminOrderDashboard'
import CustomerOTPLogin from './components/CustomerOTPLogin'


const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path='*' element={<PageNotFound />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/AdminLogin' element={<AdminLogin />}></Route>
        <Route path='/AdminDashboard' element={<AdminDashboard />}></Route>
        <Route path='/Home' element={<Home />}></Route>
        <Route path='/ProductCard' element={<ProductCard />}></Route>
        <Route path='/CheckoutPage' element={<CheckoutPage />}></Route>
        <Route path='/CustomerLogin' element={<CustomerLogin/>}></Route>
        <Route path='/CustomerOTPLogin' element={<CustomerOTPLogin/>}></Route>
        <Route path='/OrderList' element={<OrderList/>}></Route>
        <Route path='/AdminOrderDashboard' element={<AdminOrderDashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
