import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhookController } from './controllers/webhooks.js'
import passport from "passport";
import session from "express-session";
import "./configs/passport.js"; // 👈 IMPORTANT

const app = express()

await connectDB()
console.log("🔥🔥🔥 THIS SERVER.JS IS RUNNING 🔥🔥🔥");

//Stripe Webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhookController);
// Middleware
app.use(cors())
app.use(express.json())

app.use(session({ secret: "bharatek-secret", resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

console.log("Generating image...");
// Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
