import jwt from 'jsonwebtoken'
import AsyncHandler from 'express-async-handler';
import User from '../models/userModel.js'

const protect = AsyncHandler (async (req,res,next) => {
    let token

   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
   {
       try {
           token = req.headers.authorization.split(' ')[1]
           const decoded = jwt.verify(token, process.env.JWT_SECRET)

           req.user = await  User.findById(decoded.id).select('-password')

           next()
       } catch (error){
           console.error(error)
           res.status(401)
           throw new Error('Tidak teridentifikasi, token tidak ditemukan')
       }
   }

   if(!token){
       res.status(401)
       throw new Error('Tidak teridentifikasi, token tidak ditemukan')
   }
})

const admins = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else {
        res.status(401)
        throw new Error('Kamu Bukan admin ya')
    }
}

const users = (req,res,next) => {
    if(req.user){
        next()
    }else {
        res.status(401)
        throw new Error('Kamu tidak punya akses disini ya!')
    }
}

export {protect, admins, users}