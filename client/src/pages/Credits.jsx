import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const Credits = () => {


  const navigate = useNavigate();  // ✅ ADD THIS
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, axios, fetchUser } = useAppContext()

  // 🔹 Fetch Plans
  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  // 🔵 Stripe Payment
  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        '/api/credit/purchase',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // 🟣 Razorpay Payment
  const purchasePlanRazorpay = async (planId) => {
    try {
      const { data } = await axios.post(
        '/api/credit/purchase-razorpay',
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!data.success) {
        return toast.error(data.message)
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,

        order_id: data.order.id,
        name: "Bharatek AI",

       handler: async function (response) {

  const verifyRes = await axios.post(
    '/api/credit/verify-razorpay',
    response,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (verifyRes.data.success) {
    await fetchUser()   // 🔥 THIS LINE IS IMPORTANT
    toast.success("Payment Successful 🎉")
  } else {
    toast.error("Verification Failed")
  }
}

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0f18] to-black text-white w-full">

    {/* 🔹 Fixed Header */}
    <div className="sticky top-0 z-50 
                    py-4 px-4 sm:px-8
                    bg-black/60 backdrop-blur-lg
                    border-b border-white/10
                    flex items-center justify-between">

      <div className="w-8"></div>

      <h2 className="text-lg sm:text-3xl font-bold text-center
                     bg-gradient-to-r from-purple-500 to-blue-500 
                     bg-clip-text text-transparent">
        Choose Your Plan
      </h2>

      <button
        onClick={() => navigate('/')}
        className="w-8 h-8 sm:w-9 sm:h-9
                   flex items-center justify-center
                   rounded-full
                   bg-white/10 hover:bg-red-500
                   border border-white/20
                   transition-all duration-300
                   hover:rotate-90 hover:scale-110"
      >
        ✕
      </button>
    </div>

    {/* 🔹 Plans Section */}
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">

      <div className="
        w-full
        max-w-6xl
        mx-auto
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {plans.map((plan) => (
          <div
            key={plan._id}
            className="
              w-full
              bg-white/5 backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-6
              flex flex-col
              transition-all duration-300
              hover:scale-[1.02]
              hover:border-purple-500/40
              hover:shadow-lg hover:shadow-purple-500/20
            "
          >

            <h3 className="text-xl sm:text-2xl font-bold mb-3
                           bg-gradient-to-r from-purple-400 to-blue-400 
                           bg-clip-text text-transparent">
              {plan.name}
            </h3>

            <p className="text-2xl font-bold">
              ${plan.price}
              <span className="text-sm text-gray-400 font-normal">
                {" "} / {plan.credits} credits
              </span>
            </p>

            <p className="text-sm text-green-400 mt-1">
              ₹{plan.price} for Indian users 🇮🇳
            </p>

            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">

              <button
                onClick={() =>
                  toast.promise(
                    purchasePlan(plan._id),
                    { loading: "Redirecting to Stripe..." }
                  )
                }
                className="w-full py-3 rounded-xl
                           bg-gradient-to-r from-blue-600 to-indigo-600
                           text-sm font-semibold
                           transition-all duration-300
                           hover:scale-[1.03]
                           hover:shadow-blue-500/40"
              >
                Pay Internationally
              </button>

              <button
                onClick={() => purchasePlanRazorpay(plan._id)}
                className="w-full py-3 rounded-xl
                           bg-gradient-to-r from-purple-600 to-pink-600
                           text-sm font-semibold
                           transition-all duration-300
                           hover:scale-[1.03]
                           hover:shadow-purple-500/40"
              >
                Pay in India (UPI / Cards)
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>

  </div>
)





}

export default Credits
