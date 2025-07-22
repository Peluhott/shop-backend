import passport from 'passport'
import './auth/passport'
import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './User/user.routes'

dotenv.config();

const app = express()

//fill out rest later
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize)