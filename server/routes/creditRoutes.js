import express from "express";
import { getPlans, purchasePlan, purchasePlanRazorpay,verifyRazorpayPayment } from "../controllers/creditController.js";

import { protect } from "../middlewares/auth.js";



const creditRouter = express.Router();

creditRouter.get("/plan", getPlans);

creditRouter.post("/purchase", protect, purchasePlan);

creditRouter.post("/purchase-razorpay", protect, purchasePlanRazorpay);

creditRouter.post("/verify-razorpay", protect, verifyRazorpayPayment);


export default creditRouter;