import React from 'react'

import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import Sidebar from './components/Sidebar'
import { useState } from 'react'
import { FiMenu } from "react-icons/fi";

import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
const App = () => {

  const {user} =useAppContext()

const [isMenuOpen, setIsMenuOpen]= useState(false);

const {pathname} =useLocation();

if(pathname ==='/loading') return<Loading />

  return (
    <>
    {!isMenuOpen && (
  <FiMenu
    className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden text-black dark:text-white'
    onClick={() => setIsMenuOpen(true)}
  />
)}

{user ? (
 <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>

<div className='flex min-h-screen w-screen'>
    <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
<Routes>
    <Route path='/' element={<ChatBox />} />
    <Route path='/credits' element={<Credits />} />
    <Route path='/community' element={<Community />} />

</Routes>
</div>
</div>
) : (

  <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000]  h-screen w-screen flex items-center justify-center'>
    <Login />
  </div>
)}

   
    </>
  )
}

export default App