import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ErrorBoundary from './hooks/ErrorBoundary'
import Home from './pages/Home/Home'
import LoginPage from './pages/LoginPage/LoginPage.tsx'



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/basculas_digital_front' element={<LoginPage />} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path="/home" element={<Home />} />
      
        
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App