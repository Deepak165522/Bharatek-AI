import Transaction from "../models/Transaction.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

import crypto from "crypto";
import User from "../models/User.js";


import { getUser } from "./userController.js";




const plans = [

  {
    _id: "desi_starter",
    name: "Desi Starter 🇮🇳",
    price: 9, // USD for Stripe (Razorpay me INR convert hoga)
    credits: 150,
    features: [
      '150 AI text generations',
      '50 AI image generations',
      'Hindi + English support',
      'Community support',
      'Fast Indian servers'
    ]
  },

  {
    _id: "creator_pro",
    name: "Creator Pro 🚀",
    price: 19,
    credits: 400,
    features: [
      '600 AI text generations',
      '250 AI image generations',
      'Priority email support',
      'Access to advanced AI models',
      'Faster response time',
      'Early feature access'
    ]
  },

  {
    _id: "bharat_elite",
    name: "Bharat Elite 👑",
    price: 39,
    credits: 950,
    features: [
      '1500 AI text generations',
      '800 AI image generations',
      '24/7 VIP WhatsApp support',
      'All premium AI models',
      'Dedicated success manager',
      'Custom AI prompt optimization',
      'Global + India optimized performance'
    ]
  }

]



// API Controller for getting all plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});





// API Controller for purchasing a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find(plan => plan._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" });
    }

    // Create new Transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    })

    const {origin} = req.headers;

    const session = await stripe.checkout.sessions.create({
  
  line_items: [
    {
      price_data: {
        currency: 'usd',
        unit_amount: plan.price * 100, // Stripe expects amount in cents
        product_data: {
          name: plan.name
         
        },
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${origin.replace(/\/$/, '')}/loading`,

  cancel_url: `${origin}`,
  metadata: {transactionId: transaction._id.toString(), appId: "quickgpt"} ,
  expires_at: Math.floor(Date.now() /1000) + 30 * 60,
});

res.json({ success: true, url: session.url });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// API Controller for purchasing a plan via Razorpay
export const purchasePlanRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find(plan => plan._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" });
    }

    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    });

    const options = {
      amount: plan.price * 100, // Razorpay paisa me
      currency: "INR",
      receipt: transaction._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    // 🔥 Fetch order from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);

    // 🔥 Find transaction using receipt
    const transaction = await Transaction.findById(order.receipt);

    if (!transaction || transaction.isPaid) {
      return res.json({ success: true });
    }

    // 🔥 Add credits
    await User.updateOne(
      { _id: transaction.userId },
      { $inc: { credits: transaction.credits } }
    );

    transaction.isPaid = true;
    await transaction.save();

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

