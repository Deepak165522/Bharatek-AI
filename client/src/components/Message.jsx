import React, { use } from 'react'
import { FiUser } from "react-icons/fi";
import moment from 'moment';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import { useEffect } from 'react';
import toast from "react-hot-toast"
import { FiCopy } from "react-icons/fi"



const Message = ({ message }) => {


  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);


const handleCopyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard ✅")
  } catch (err) {
    toast.error("Copy failed ❌")
  }
}


  return (
  <div>
    {message.role === "user" ? (

      /* ================= USER MESSAGE ================= */
      <div className="flex justify-end my-6 px-2 sm:px-4">

        <div className="flex items-end gap-3 max-w-[85%] sm:max-w-2xl">

          {/* Bubble */}
          <div className="relative group 
                          px-4 py-3 rounded-2xl 
                          bg-gradient-to-r from-purple-500 to-blue-500 
                          text-white text-sm
                          shadow-md transition-all duration-300">

            <p className="leading-relaxed">
              {message.content}
            </p>

            {/* Copy Button */}
            <button
  onClick={() => handleCopyText(message.content)}
  className="absolute -bottom-6 right-0
             flex items-center gap-1
             opacity-0 group-hover:opacity-100
             text-[11px] text-gray-400
             hover:text-purple-400
             transition-all duration-300"
>
  <FiCopy size={14} />
  
</button>


            <span className="block text-[10px] mt-2 opacity-70 text-right">
              {moment(message.timestamp).fromNow()}
            </span>

          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full 
                          flex items-center justify-center
                          bg-gradient-to-br from-purple-500 to-blue-500
                          shadow-md">
            <FiUser className="w-4 h-4 text-white" />
          </div>

        </div>
      </div>

    ) : (

      /* ================= AI MESSAGE ================= */
      <div className="flex justify-start my-6 px-2 sm:px-4">

        <div className="flex items-start gap-3 max-w-[85%] sm:max-w-2xl">

          {/* AI Avatar */}
          <div className="w-9 h-9 rounded-full 
                          flex items-center justify-center
                          bg-black dark:bg-white/10
                          border border-purple-500
                          shadow-md">
            <img
              src="/logofinal.png"
              alt="AI"
              className="w-5 h-5 object-contain"
            />
          </div>

          {/* Bubble */}
          <div className="relative group
                          px-4 py-3 rounded-2xl 
                          bg-white dark:bg-white/5
                          border border-gray-200 dark:border-white/10
                          text-gray-800 dark:text-gray-100
                          text-sm
                          shadow-sm backdrop-blur-md">

            <div className="relative group">

  {message.isImage ? (
    <>
      <img
        src={message.content}
        alt=""
        className="w-full max-w-md rounded-xl shadow-md"
      />

      {/* Copy Image URL Button */}
      <button
        onClick={() => handleCopyText(message.content)}
        className="absolute top-2 right-2
                   flex items-center gap-1
                   px-2 py-1 rounded-md
                   bg-black/50 backdrop-blur
                   border border-white/20
                   text-xs text-white
                   opacity-0 group-hover:opacity-100
                   hover:bg-purple-600
                   transition-all duration-300"
      >
        <FiCopy size={14} />
      </button>
    </>
  ) : (
    <>
      <div className="reset-tw leading-relaxed">
        <Markdown
  components={{
    code({ node, inline, className, children, ...props }) {
      const codeText = String(children).replace(/\n$/, "")

      return !inline ? (
        <div className="relative group my-4">

          {/* Copy Button */}
          <button
            onClick={() => handleCopyText(codeText)}
            className="absolute top-2 right-2
                       opacity-0 group-hover:opacity-100
                       bg-black/60 backdrop-blur
                       text-white text-xs
                       px-2 py-1 rounded-md
                       hover:bg-purple-600
                       transition-all duration-300"
          >
            <FiCopy size={14} />
          </button>

          <pre className="
  bg-gray-900 text-green-400
  dark:bg-black dark:text-green-300
  rounded-lg p-4 overflow-x-auto text-sm
">

            <code className={className} {...props}>
              {children}
            </code>
          </pre>

        </div>
      ) : (
        <code className="
  bg-gray-200 text-purple-600
  dark:bg-white/10 dark:text-purple-300
  px-1.5 py-0.5 rounded text-sm
">

          {children}
        </code>
      )
    }
  }}
>
  {message.content}
</Markdown>

      </div>

      {/* Copy Text Button */}
      <button
        onClick={() => handleCopyText(message.content)}
        className="absolute -bottom-6 right-0
                   flex items-center gap-1
                   px-2 py-1 rounded-md
                   bg-black/40 dark:bg-white/10
                   backdrop-blur
                   border border-white/10
                   text-xs text-gray-300 dark:text-gray-200
                   opacity-0 group-hover:opacity-100
                   hover:bg-purple-600 hover:text-white
                   transition-all duration-300"
      >
        <FiCopy size={14} />
        Copy
      </button>
    </>
  )}

</div>


            {/* Copy Button */}
            {!message.isImage && (
             <button
  onClick={() => handleCopyText(message.content)}
  className="absolute -bottom-6 right-0
             flex items-center gap-1
             opacity-0 group-hover:opacity-100
             text-xs text-gray-500 dark:text-gray-400
             hover:text-purple-500
             transition-all duration-300"
>
  {/* <FiCopy size={14} /> */}
  
</button>

            )}

            <span className="block text-[10px] mt-2 text-gray-400 dark:text-gray-500">
              {moment(message.timestamp).fromNow()}
            </span>

          </div>

        </div>
      </div>

    )}
  </div>
)


}

export default Message
