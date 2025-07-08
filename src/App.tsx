import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  LoginForm  from './components/LoginForm/LoginForm.tsx'
import './App.css'
import ErrorBoundary from './hooks/ErrorBoundary'


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
      <Route path='/login' element={<LoginForm />} />
      
        
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App