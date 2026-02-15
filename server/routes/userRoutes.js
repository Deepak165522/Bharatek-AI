import express from "express";
import { getPublishedImages, getUser, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get("/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
 (req, res) => {
  const token = jwt.sign(
    { id: req.user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.redirect(`http://localhost:5173/google-success?token=${token}`);
}
);


userRouter.get("/data", protect, getUser);
userRouter.get("/published-images", getPublishedImages);

export default userRouter;

