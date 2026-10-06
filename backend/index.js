import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const Port = 8080;

dotenv.config()

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("Db Connected")
}).catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.frontendUrl,
            'http://localhost:5173',
            'http://localhost:5174'
        ].filter(Boolean)

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true
}))

app.use('/customers' , customerRoutes)
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);



app.get('/', (req, res) => {
    res.send('Okay Okay')
})


app.listen(Port, () => {
    console.log(`Server Started at ${Port}`)
})


/* */
