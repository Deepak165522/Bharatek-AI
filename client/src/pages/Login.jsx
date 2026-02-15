import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";


const Login = () => {

const [state, setState] = useState("login");
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const {axios, setToken} = useAppContext()


const handleSubmit = async (e) => {
  e.preventDefault();
  const url = state === "login" ? "/api/user/login" : "/api/user/register";

  try {
    const { data } = await axios.post(url, { name, email, password });
    if (data.success) {
      setToken(data.token)
      localStorage.setItem('token', data.token)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
}


return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

  {/* Background */}
  <img
    src="/bacground.png"
    alt="background"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

  {/* Login Card */}
  <div className="relative z-10 w-full flex items-center justify-center px-4">

    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-md
        p-8
        rounded-3xl
        bg-white/5
        backdrop-blur-2xl
        border border-white/20
        shadow-2xl
        text-white
      "
    >

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">

  {/* Glow Ring */}
  <div className="relative w-20 h-20">

    {/* Outer Glow */}
    <div className="absolute inset-0 rounded-full 
                    bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 
                    blur-md opacity-70">
    </div>

    {/* Main Circle */}
    <div className="relative w-full h-full 
                    rounded-full 
                    border-[3px] border-purple-600
                    flex items-center justify-center
                    bg-black shadow-xl">

      <img
        src="/logofinal.png"
        alt="Bharatek AI"
        className="w-4/5 object-contain"
      />
    </div>

  </div>

  {/* Brand Name */}
  <h1 className="mt-5 text-2xl font-bold 
                 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500
                 bg-clip-text text-transparent tracking-wide">
    Bharatek AI
  </h1>

  {/* Tagline */}
  <p className="text-xs mt-1
                bg-gradient-to-r from-purple-400 to-blue-400
                bg-clip-text text-transparent tracking-wide drop-shadow-md">
    Empowering Your Conversations
  </p>

</div>


      <h2 className="text-center text-xl sm:text-2xl font-bold mb-6
               bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400
               bg-clip-text text-transparent tracking-wide">
  {state === "login" ? "Welcome Back 👋" : "Create Account ✨"}
</h2>


      {state === "register" && (
        <div className="mb-4">
          <label className="text-sm text-gray-300">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            className="w-full mt-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
          />
        </div>
      )}

      <div className="mb-5 group">
  <label className="text-xs sm:text-sm text-gray-300 
                    group-focus-within:text-purple-400 
                    transition-all duration-300">
    Email
  </label>

  <div className="relative mt-1">
    {/* Glow Layer */}
    <div className="absolute inset-0 rounded-lg 
                    bg-gradient-to-r from-purple-500 to-blue-500
                    opacity-0 group-hover:opacity-10 
                    group-focus-within:opacity-20
                    blur-md transition-all duration-300">
    </div>

    <input
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      type="email"
      required
      className="
        relative z-10
        w-full px-4 py-2.5
        rounded-lg
        bg-white/10
        backdrop-blur-md
        border border-white/20
        text-white
        placeholder:text-gray-400
        outline-none
        transition-all duration-300

        hover:border-purple-400/60
        hover:bg-white/15

        focus:border-purple-500
        focus:ring-2
        focus:ring-purple-500/40
        focus:bg-white/15
      "
      placeholder="Enter your email"
    />
  </div>
</div>


      <div className="mb-5 group">
  <label className="text-xs sm:text-sm text-gray-300 
                    group-focus-within:text-purple-400 
                    transition-all duration-300">
    Password
  </label>

  <div className="relative mt-1">
    {/* Glow Effect */}
    <div className="absolute inset-0 rounded-lg 
                    bg-gradient-to-r from-purple-500 to-blue-500
                    opacity-0 group-hover:opacity-10 
                    group-focus-within:opacity-20
                    blur-md transition-all duration-300">
    </div>

    <input
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      type="password"
      required
      placeholder="Enter your password"
      className="
        relative z-10
        w-full px-4 py-2.5
        rounded-lg
        bg-white/10
        backdrop-blur-md
        border border-white/20
        text-white
        placeholder:text-gray-400
        outline-none
        transition-all duration-300

        hover:border-purple-400/60
        hover:bg-white/15

        focus:border-purple-500
        focus:ring-2
        focus:ring-purple-500/40
        focus:bg-white/15
      "
    />
  </div>
</div>


      {/* Switch */}
      <p className="text-xs sm:text-sm text-gray-300 text-center mt-2 mb-6">
  {state === "register" ? (
    <>
      Already part of the AI revolution?{" "}
      <span
        onClick={() => setState("login")}
        className="
          bg-gradient-to-r from-purple-400 to-blue-400
          bg-clip-text text-transparent
          font-semibold
          cursor-pointer
          relative
          transition-all duration-300
          hover:opacity-80
        "
      >
        Sign In
      </span>
    </>
  ) : (
    <>
      Ready to unlock intelligent conversations?{" "}
      <span
        onClick={() => setState("register")}
        className="
          bg-gradient-to-r from-purple-400 to-blue-400
          bg-clip-text text-transparent
          font-semibold
          cursor-pointer
          relative
          transition-all duration-300
          hover:opacity-80
        "
      >
        Create Account
      </span>
    </>
  )}
</p>


      <button
  type="submit"
  className="
    relative w-full py-3 rounded-xl
    font-semibold tracking-wide text-white
    overflow-hidden group
    bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
    shadow-lg shadow-purple-500/30
    transition-all duration-300
    hover:scale-[1.03]
    hover:shadow-purple-500/50
    active:scale-[0.98]
  "
>
  {/* Glow Layer */}
  <span
    className="
      absolute inset-0
      bg-gradient-to-r from-purple-500 to-blue-500
      opacity-0 group-hover:opacity-20
      blur-xl transition-all duration-300
    "
  ></span>

  <span className="relative z-10">
    {state === "register" ? "Create Account ✨" : "Sign In 🚀"}
  </span>
</button>

<div className="flex items-center my-6">
  <div className="flex-1 h-px bg-white/20"></div>
  <span className="px-3 text-xs text-gray-400">OR</span>
  <div className="flex-1 h-px bg-white/20"></div>
</div>

<button
  type="button"
  onClick={() =>
    window.location.href =
      `${import.meta.env.VITE_SERVER_URL}/api/user/auth/google`
  }
  className="
    w-full py-3 rounded-xl
    font-medium
    flex items-center justify-center gap-3
    transition-all duration-300

    bg-white text-gray-800 border border-gray-300
    hover:bg-gray-100 hover:shadow-md

    dark:bg-white/10 dark:text-white dark:border-white/20
    dark:hover:bg-white/20 dark:hover:shadow-lg
  "
>
  <FcGoogle size={20} />
  Continue with Google
</button>


    </form>

  



  </div>
</div>

)




  
}

export default Login
