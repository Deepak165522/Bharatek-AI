import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { FiPlus, FiSearch , FiTrash2, FiImage , FiMoon, FiUser, FiLogOut,FiX} from 'react-icons/fi'
import { RiVipDiamondLine } from "react-icons/ri";

// import { FiDiamond } from "react-icons/fi";

import moment from 'moment/moment'
import toast from 'react-hot-toast';
const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {

  const { chats, setSelectedChat, theme, setTheme, user, navigate,createNewChat, axios, setChats, fetchUsersChats, setToken, token } = useAppContext()
  const [search, setSearch] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success("Logged out successfully")
  }

const deleteChat = async (e, chatId) => {
  try {
    e.stopPropagation()

    const confirm = window.confirm('Are you sure you want to delete this chat?')
    if (!confirm) return

    const { data } = await axios.post('/api/chat/delete', { chatId }, {
      headers: { Authorization: token }
    })

    if (data.success) {
      setChats(prev => prev.filter(chat => chat._id !== chatId))
      await fetchUsersChats()
      toast.success(data.message)
    }

  } catch (error) {
    toast.error(error.message)
  }
}


  return (
  <div
    className={`flex flex-col h-screen w-72 max-md:w-[85%]
    p-4
    dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30
    border-r border-[#80609F]/30 backdrop-blur-3xl
    transition-all duration-500
    max-md:fixed max-md:top-0 max-md:left-0
    max-md:z-50
    ${!isMenuOpen && 'max-md:-translate-x-full'}`}
  >

    {/* ================= TOP SECTION ================= */}
    <div className="shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
          <div className="absolute inset-0 rounded-full 
                          bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 
                          blur-md opacity-70">
          </div>

          <div className="relative w-full h-full 
                          rounded-full border-2 border-purple-600 
                          flex items-center justify-center 
                          bg-black shadow-lg">
            <img
              src="/logofinal.png"
              alt="Bhartek AI"
              className="w-3/4 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col leading-tight">
          <h1 className="text-sm sm:text-base font-bold 
                         bg-gradient-to-r from-purple-500 to-blue-500 
                         bg-clip-text text-transparent tracking-wide">
            Bhartek AI
          </h1>

          <p className="text-[10px] sm:text-xs 
                        bg-gradient-to-r from-purple-400 to-blue-400 
                        bg-clip-text text-transparent tracking-wide">
            Empowering Conversations
          </p>
        </div>
      </div>

      {/* New Chat Button */}
      <button
   onClick={() => {
    createNewChat();
    setIsMenuOpen(false);   // 👈 Ye line add karo
  }}
  
  className="
    relative group
    flex items-center justify-center gap-2
    w-full py-2.5 mt-4
    text-xs sm:text-sm font-semibold tracking-wide text-white
    rounded-lg
    bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
    shadow-lg
    overflow-hidden
    transition-all duration-300
    hover:scale-[1.03]
    hover:shadow-purple-500/50
  "
>
  {/* Glow Hover Layer */}
  <span className="
    absolute inset-0
    bg-gradient-to-r from-purple-500 to-blue-500
    opacity-0 group-hover:opacity-20
    blur-md
    transition-all duration-300
  "></span>

  {/* Icon */}
  <FiPlus className="relative z-10 text-sm sm:text-base" />

  {/* Text */}
  <span className="relative z-10">
    Start New Chat
  </span>
</button>


      {/* Search */}
      <div
  className="
    relative group
    flex items-center gap-2 mt-4
    px-3 py-2
    rounded-lg
    bg-white/10 dark:bg-white/5
    backdrop-blur-md
    border border-white/10
    shadow-sm
    transition-all duration-300
    focus-within:border-purple-500
    focus-within:ring-2 focus-within:ring-purple-500/40
  "
>
  {/* Soft Glow on Focus */}
  <span
    className="
      absolute inset-0 rounded-lg
      bg-gradient-to-r from-purple-500 to-blue-500
      opacity-0 group-focus-within:opacity-10
      transition-all duration-300
    "
  ></span>

  {/* Icon */}
  <FiSearch
    className="
      relative z-10
      text-gray-400 text-sm
      group-focus-within:text-purple-400
      transition-colors duration-300
    "
  />

  {/* Input */}
  <input
    onChange={(e) => setSearch(e.target.value)}
    value={search}
    type="text"
    placeholder="Search conversations..."
    className="
      relative z-10
      bg-transparent outline-none
      text-xs sm:text-sm w-full
      text-gray-800 dark:text-white
      placeholder:text-gray-400
    "
  />
</div>


    </div>


    {/* ================= CHAT LIST ================= */}
    <div className="flex-1 overflow-y-auto mt-4 pr-1 min-h-0">

  {chats.length > 0 && (
    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 px-1">
      Recent Conversations
    </p>
  )}

  <div className="space-y-2">
    {chats
      .filter((chat) =>
        chat.messages[0]
          ? chat.messages[0]?.content
              .toLowerCase()
              .includes(search.toLowerCase())
          : chat.name
              .toLowerCase()
              .includes(search.toLowerCase())
      )
      .map((chat) => (
        <div
          key={chat._id}
          onClick={() => {
            navigate('/');
            setSelectedChat(chat);
            setIsMenuOpen(false);
          }}
          className="
            relative group
            px-3 py-2
            rounded-lg
            bg-white/5 dark:bg-white/5
            border border-white/10
            cursor-pointer
            transition-all duration-200
            hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10
            hover:border-purple-500/40
            flex justify-between items-center
          "
        >
          {/* Soft hover glow */}
          <span className="
            absolute inset-0 rounded-lg
            bg-gradient-to-r from-purple-500 to-blue-500
            opacity-0 group-hover:opacity-5
            transition-all duration-300
          "></span>

          {/* Chat Info */}
          <div className="relative z-10 flex-1 min-w-0">
  
  <p className="truncate text-xs sm:text-sm font-medium
    text-gray-800 dark:text-gray-200">
    {chat.messages.length > 0
      ? chat.messages[0].content.slice(0, 26)
      : chat.name}
  </p>

  <p className="text-[9px]
    text-gray-500 dark:text-gray-400">
    {moment(chat.updatedAt).fromNow()}
  </p>

</div>


          {/* Delete Icon */}
          <FiTrash2
            onClick={(e) =>
              toast.promise(deleteChat(e, chat._id), {
                loading: "Deleting...",
              })
            }
            className="
              relative z-10
              w-3.5 h-3.5
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              text-gray-400 hover:text-red-500
              cursor-pointer
            "
          />
        </div>
      ))}
  </div>

</div>



    {/* ================= BOTTOM SECTION ================= */}
    <div className="shrink-0 space-y-4 pt-4">

  {/* 🌌 Community Showcase */}
  <div
    onClick={() => {
      navigate('/community');
      setIsMenuOpen(false);
    }}
    className="
      group
      flex items-center gap-3
      p-3 rounded-xl
      bg-gradient-to-r from-purple-500/10 to-blue-500/10
      border border-purple-500/20
      backdrop-blur-md
      cursor-pointer
      transition-all duration-300
      hover:scale-[1.02]
      hover:border-purple-500/40
      hover:shadow-lg hover:shadow-purple-500/20
    "
  >
    {/* Icon Box */}
    <div className="
        w-8 h-8
        flex items-center justify-center
        rounded-lg
        bg-gradient-to-br from-purple-500 to-blue-500
        text-white
        shadow-md
        group-hover:scale-110
        transition-all duration-300
    ">
      <FiImage className="w-4 h-4" />
    </div>

    <div className="flex flex-col">
      <p className="text-xs sm:text-sm font-semibold
         bg-gradient-to-r from-purple-400 to-blue-400
         bg-clip-text text-transparent tracking-wide">
        Community Showcase
      </p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">
        Explore AI Creations
      </p>
    </div>
  </div>

  {/* 💎 AI Credit Vault */}
  <div
    onClick={() => {
      navigate('/credits');
      setIsMenuOpen(false);
    }}
    className="
      group
      flex items-center gap-3
      p-3 rounded-xl
      bg-gradient-to-r from-yellow-500/10 to-purple-500/10
      border border-yellow-400/20
      backdrop-blur-md
      cursor-pointer
      transition-all duration-300
      hover:scale-[1.02]
      hover:border-yellow-400/40
      hover:shadow-lg hover:shadow-yellow-400/20
    "
  >
    <div className="
        w-8 h-8
        flex items-center justify-center
        rounded-lg
        bg-gradient-to-br from-yellow-400 to-purple-500
        text-white
        shadow-md
        group-hover:scale-110
        transition-all duration-300
    ">
      <RiVipDiamondLine className="w-4 h-4" />
    </div>

    <div className="flex flex-col flex-1">
      <p className="text-xs sm:text-sm font-semibold
         bg-gradient-to-r from-yellow-400 to-purple-500
         bg-clip-text text-transparent tracking-wide">
        AI Credit Vault
      </p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">
        Available Credits: {user?.credits}
      </p>
    </div>

    <span className="text-[9px] px-2 py-0.5 rounded-full
       bg-yellow-400/20 text-yellow-500 font-semibold">
      PRO
    </span>
  </div>

  {/* 🌙 Appearance Mode */}
  <div
    className="
      group
      flex items-center justify-between
      p-3 rounded-xl
      bg-gradient-to-r from-gray-500/10 to-purple-500/10
      border border-white/10
      backdrop-blur-md
      transition-all duration-300
      hover:border-purple-500/30
      hover:shadow-md hover:shadow-purple-500/10
    "
  >
    <div className="flex items-center gap-3">
      <div className="
          w-8 h-8 flex items-center justify-center
          rounded-lg
          bg-gradient-to-br from-indigo-500 to-purple-600
          text-white shadow-md
      ">
        <FiMoon className="w-4 h-4" />
      </div>

      <div className="flex flex-col">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">
          Appearance Mode
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Light / Dark
        </p>
      </div>
    </div>

    <label className="relative inline-flex cursor-pointer">
      <input
        onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        type="checkbox"
        className="sr-only peer"
        checked={theme === 'dark'}
      />
      <div className="w-10 h-5 bg-gray-400 rounded-full
        peer-checked:bg-gradient-to-r
        peer-checked:from-purple-500 peer-checked:to-blue-500
        transition-all duration-300">
      </div>
      <span className="absolute left-1 top-1 w-3.5 h-3.5
        bg-white rounded-full shadow-md
        transition-transform duration-300
        peer-checked:translate-x-5">
      </span>
    </label>
  </div>

  {/* 👤 User Section */}
  <div
    className="
      group
      flex items-center gap-3
      p-3 rounded-xl
      bg-gradient-to-r from-purple-500/10 to-blue-500/10
      border border-white/10
      backdrop-blur-md
      transition-all duration-300
      hover:border-purple-500/30
      hover:shadow-md hover:shadow-purple-500/20
    "
  >
    <div className="
        w-9 h-9 flex items-center justify-center
        rounded-full
        bg-gradient-to-br from-purple-500 to-blue-500
        text-white shadow-md
    ">
      <FiUser className="w-4 h-4" />
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-semibold truncate text-gray-800 dark:text-white">
        {user ? user.name : "Login Your Account"}
      </p>
      {user && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Active Session
        </p>
      )}
    </div>

    {user && (
      <FiLogOut
  onClick={logout}
  className="
    w-4 h-4
    text-gray-500 dark:text-gray-300
    hover:text-red-500 dark:hover:text-red-400
    opacity-0 group-hover:opacity-100
    transition-all duration-300
    cursor-pointer
  "
  title="Logout"
/>

    )}
  </div>

</div>



    {/* Close Button (Mobile) */}
    <FiX
  onClick={() => setIsMenuOpen(false)}
  className="
    absolute top-4 right-4
    w-9 h-9 p-2
    rounded-full
    bg-gradient-to-br from-purple-500/20 to-blue-500/20
    backdrop-blur-md
    border border-white/20
    text-gray-800 dark:text-white
    shadow-md
    cursor-pointer
    transition-all duration-300
    hover:scale-110
    hover:rotate-90
    hover:bg-gradient-to-br
    hover:from-purple-500
    hover:to-blue-500
    hover:text-white
    hover:shadow-purple-500/40
    md:hidden
  "
/>


  </div>
);

}

export default Sidebar

