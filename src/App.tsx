import { Route, Routes } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Home from './components/Home'

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path='*' element={<PageNotFound />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/AdminDashboard' element={<AdminDashboard />}></Route>
        <Route path='/Home' element={<Home />}></Route>
      </Routes>
    </>
  )
}

export default App
