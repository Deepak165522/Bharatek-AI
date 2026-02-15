import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { FiMessageCircle } from "react-icons/fi"
import Message from './Message'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const containerRef=useRef(null);

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

 const onSubmit = async (e) => {
  try {
    e.preventDefault()

    if (!user) return toast('Login to send message')

    setLoading(true)

    const promptCopy = prompt
    setPrompt("")

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
        isImage: false
      }
    ])

    const { data } = await axios.post(`/api/message/${mode}`, {
      chatId: selectedChat._id,
      prompt,
      isPublished
    }, {
      headers: { Authorization: token }
    })

    if (data.success) {
      setMessages(prev => [...prev, data.reply])
      // decrease credits
      if(mode === 'image') {
        setUser(prev => ({
          ...prev,
          credits: prev.credits - 2
        }))
      }else{
        setUser(prev => ({
          ...prev,
          credits: prev.credits - 1
        }))
      }
    } else {
      toast.error(data.message)
      setPrompt(promptCopy)
    }

  } catch (error) {

    toast.error(error.message)
  }finally {
    setLoading(false) 
    setPrompt('')


  }
}


  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

 useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }
}, [messages])


  

  return (

    
  <div className="h-screen w-full flex justify-center overflow-hidden">
  <div className="flex flex-col h-full w-full ">


{/* 🔥 Chat Header */}


      <div className="shrink-0 
                bg-white/70 dark:bg-black/40
                backdrop-blur-xl
                border-b border-gray-200 dark:border-white/10
                shadow-sm">

 <div className="w-full px-8 py-3 flex items-center gap-4">



    {/* Glow Logo */}
    <div className="relative w-10 h-10">

      <div className="absolute inset-0 rounded-full 
                      bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 
                      blur-md opacity-70">
      </div>

      <div className="relative w-full h-full 
                      rounded-full 
                      border-[2px] border-purple-500
                      flex items-center justify-center 
                      bg-black shadow-md">

        <img
          src="/logofinal.png"
          alt="Bharatek AI"
          className="w-4/5 object-contain"
        />
      </div>
    </div>

    {/* Brand Text */}
    <div className="flex flex-col leading-tight">
      <h1 className="text-sm sm:text-base font-bold 
                     bg-gradient-to-r from-purple-500 to-blue-500
                     bg-clip-text text-transparent tracking-wide">
        Bharatek AI
      </h1>

      <p className="
  text-[11px]
  bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500
  bg-clip-text text-transparent
  tracking-wide
  opacity-90
">
  Empowering Your Conversations
</p>

    </div>

  </div>
</div>            


    {/* Scrollable Messages Area */}
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth px-2
           pb-32 pt-2"

    >

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-8">

          {/* Logo Circle */}
          <div className="relative w-60 h-60 sm:w-72 sm:h-72">

            {/* Glow */}
            <div className="absolute inset-0 rounded-full 
                            bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 
                            blur-2xl opacity-70">
            </div>

            {/* Main Circle */}
            <div className="relative w-full h-full 
                            rounded-full 
                            border-[8px] border-purple-600 
                            flex items-center justify-center 
                            bg-black shadow-2xl">

              <img
                src="/logofinal.png"
                alt="Bhartek AI"
                className="w-5/6 object-contain"
              />

            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold 
                         bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 
                         bg-clip-text text-transparent text-center">
            Ask me anything.
          </h1>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
  <Message
    key={index}
    message={message}
    index={index}
    messages={messages}
    setMessages={setMessages}
  />
))}


      {/* Typing Loader */}
      {loading && (
        <div className="flex items-center gap-1.5 px-2 mt-3">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
        </div>
      )}
    </div>

    {/* Publish Option */}
    {mode === 'image' && (
      <label className="inline-flex items-center gap-2 mb-20 text-sm mx-auto">
        <p className="text-xs">Publish Generated Image to Community</p>
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
      </label>
    )}

    {/* Fixed Prompt Input */}
    <form
  onSubmit={onSubmit}
  className="
  sticky bottom-4
  mx-auto
  w-full
  max-w-3xl

  bg-white/60 dark:bg-[#1E1A2E]/60
  backdrop-blur-2xl

  border border-white/40 dark:border-white/10
  rounded-3xl

  px-4 py-3
  flex items-center gap-3

  shadow-[0_8px_30px_rgba(0,0,0,0.12)]
  dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]

  focus-within:ring-2
  focus-within:ring-purple-500/40

  transition-all duration-300
  "
>



      <select
        onChange={(e) => setMode(e.target.value)}
        value={mode}
        className="text-sm pl-3 pr-2 outline-none bg-transparent"
      >
        <option className="dark:bg-purple-900" value="text">Text</option>
        <option className="dark:bg-purple-900" value="image">Image</option>
      </select>

      <input
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        type="text"
        placeholder="Type your prompt here..."
        className="flex-1 w-full text-sm outline-none bg-transparent"
        required
      />

      <button disabled={loading}>
        <img
          src={loading ? assets.stop_icon : assets.send_icon}
          className="w-8 cursor-pointer"
          alt=""
        />
      </button>

    </form>
  </div>
  </div>
)

}

export default ChatBox
