import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Form from './components/Form/Form';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Quiz from './components/Quiz/Quiz';
import Analytics from './components/Analytics/Analytics';
import Analysis from './components/Analytics/Analysis';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Form/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/quiz/:quizId' element={<Quiz/>}/>
          <Route path='/analytics' element={<Analytics/>}/>
          <Route path='/analysis/:quizId' element={<Analysis/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
