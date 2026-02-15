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
import {Toaster} from 'react-hot-toast'
import GoogleSuccess from './pages/GoogleSuccess'

const App = () => {

  const {user, loadingUser} =useAppContext()

const [isMenuOpen, setIsMenuOpen]= useState(false);

const {pathname} =useLocation();

if(pathname ==='/loading' || loadingUser) return<Loading />

  return (
    <>
<Toaster />

    {!isMenuOpen && (
  <div className="fixed top-0 left-0 w-full z-40
                  md:hidden
                  bg-white/70 dark:bg-black/40
                  backdrop-blur-xl
                  border-b border-gray-200 dark:border-white/10
                  shadow-md">

    <div className="flex items-center gap-4 px-5 py-4">

      {/* Menu Icon */}
      <FiMenu
        onClick={() => setIsMenuOpen(true)}
        className="w-7 h-7 cursor-pointer 
                   text-gray-800 dark:text-white
                   hover:text-purple-500
                   transition-all duration-300"
      />

      {/* Logo + Brand */}
      <div className="flex items-center gap-3">

        <div className="relative w-11 h-11">
          <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 
                          blur-md opacity-70" />
          <div className="relative w-full h-full 
                          rounded-full 
                          border-[2px] border-purple-500
                          flex items-center justify-center 
                          bg-black shadow-lg">
            <img
              src="/logofinal.png"
              alt="Bharatek AI"
              className="w-4/5 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col leading-tight">
          <h1 className="text-base font-bold 
                         bg-gradient-to-r from-purple-500 to-blue-500
                         bg-clip-text text-transparent">
            Bharatek AI
          </h1>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Empowering Your Conversations
          </p>
        </div>

      </div>

    </div>
  </div>
)}


{user || pathname === "/google-success" ? (
 <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>

<div className='flex min-h-screen w-screen'>
    {user && (
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    )}

<Routes>
    <Route path='/' element={<ChatBox />} />
    <Route path='/credits' element={<Credits />} />
    <Route path='/community' element={<Community />} />
    <Route path="/google-success" element={<GoogleSuccess />} />
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