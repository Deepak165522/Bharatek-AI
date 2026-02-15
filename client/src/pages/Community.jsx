import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'

const Community = () => {


  const [images, setImages] = useState([])
const [loading, setLoading] = useState(true)
const {axios} = useAppContext()

const fetchImages = async () => {
  try {
    const { data } = await axios.get('/api/user/published-images')

    if (data.success) {
      setImages(data.images)
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    toast.error(error.message)
  }

  setLoading(false)
}


useEffect(() => {
  fetchImages()
}, [])

if (loading) return <Loading />

  return (
  <div className="min-h-screen w-full 
                  px-4 sm:px-6 xl:px-12 2xl:px-20 
                  py-10 overflow-y-auto">

    {/* 🔹 Title */}
    <h2 className="text-2xl sm:text-3xl font-bold mb-8
                   bg-gradient-to-r from-purple-500 to-blue-500
                   bg-clip-text text-transparent">
      Community Showcase
    </h2>

    {images.length > 0 ? (

      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        xl:grid-cols-4 
        gap-6
      ">

        {images.map((item, index) => (
          <a
            key={index}
            href={item.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative overflow-hidden rounded-2xl
              bg-white/5 dark:bg-white/5
              backdrop-blur-lg
              border border-gray-200 dark:border-white/10
              shadow-md
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-xl hover:shadow-purple-500/20
              hover:border-purple-500/40
            "
          >

            {/* Image */}
            <img
              src={item.imageUrl}
              alt=""
              className="
                w-full h-48 sm:h-52 md:h-56 xl:h-60
                object-cover
                transition-transform duration-500
                group-hover:scale-110
              "
            />

            {/* Dark Overlay on Hover */}
            <div className="
              absolute inset-0 
              bg-gradient-to-t from-black/70 via-black/20 to-transparent
              opacity-0 group-hover:opacity-100
              transition duration-300
            "></div>

            {/* Creator Badge */}
            <div className="
              absolute bottom-4 left-4 right-4
              opacity-0 group-hover:opacity-100
              transition duration-300
            ">
              {/* <p className="
                text-xs sm:text-sm
                px-4 py-2
                rounded-full
                bg-black/60 backdrop-blur-md
                border border-white/10
                text-white
                text-center
                shadow-md
              ">
                Created by <span className="text-purple-400 font-semibold">
                  {item.userName}
                </span>
              </p> */}
            </div>

          </a>
        ))}

      </div>

    ) : (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          🚀 No images available yet.
        </p>
      </div>
    )}

  </div>
)

}

export default Community