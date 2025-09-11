import passport from 'passport'
import './auth/passport'
import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './User/user.routes'
import cartRouter from './Cart/cart.routes'
import orderRouter from './Order/order.routes'
import productRouter from './Product/product.routes'
import aiRouter from './ai/ai.routes'
import cors from 'cors';


dotenv.config();

const app = express()

//fill out rest later
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}))
app.use('/user', userRoutes);
app.use('/cart', cartRouter)
app.use('/order', orderRouter)
app.use('/product', productRouter)
app.use('/ai', aiRouter)



export default app;