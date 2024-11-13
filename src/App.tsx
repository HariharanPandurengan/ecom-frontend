import { Route , Routes } from 'react-router-dom'
import PageNotFound from './components/PageNotFound'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

const App: React.FC = () => {

  return (
    <>
      <Routes>
        <Route path='*' element={<PageNotFound/>}></Route>
        <Route path='/' element={<AdminLogin/>}></Route>
        <Route path='/AdminDashboard' element={<AdminDashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
