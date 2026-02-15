import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {

  const navigate = useNavigate()

  const {fetchUser} = useAppContext()

useEffect(() => {
  const timeout = setTimeout(() => {
    fetchUser()
    navigate('/')
  }, 4000)

  return () => clearTimeout(timeout)
}, [])

  return (
  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

    {/* Background Image */}
    <img
      src="/bacground.png"
      alt="AI Background"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Dark Overlay for better visibility */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    {/* Loader Content */}
    <div className="relative z-10 flex flex-col items-center gap-6">

      {/* Spinner */}
      <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin shadow-lg"></div>

      {/* Optional Text */}
      <p className="text-sm sm:text-base tracking-wide text-gray-200">
        Initializing Bharatek AI...
      </p>

    </div>

  </div>
);


}

export default Loading