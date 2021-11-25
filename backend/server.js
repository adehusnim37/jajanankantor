import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import passport from 'passport';
import session from 'express-session';

import {notFound,errorHandler} from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import passportjs from './config/passport.js'
import productRoutes from "./routes/productRoutes.js";
import userRoutes from './routes/userRoutes.js'
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB from "./config/db.js";
import midTransRoutes from "./routes/midTransRoutes.js";


dotenv.config()

passportjs(passport);

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productRoutes)
app.use('/api/users',userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/config/midtrans',midTransRoutes)

app.get('/api/config/paypal', (req, res)  =>
    res.send(process.env.PAYPAL_CLIENT_ID)
)

// app.use(snap.createTransactionToken())

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
}


app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server berjalan di ${process.env.NODE_ENV} dan ${PORT} port`.green.bold))