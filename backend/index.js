import express from 'express'
import mongoose from 'mongoose'
import "dotenv/config";
import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from "./routes/order.routes.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const Port = process.env.PORT || 8080;

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
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174'
        ].filter(Boolean)

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(null, false)
    },
    credentials: true
}))

app.use('/customers' , customerRoutes)
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use("/orders", orderRoutes);

app.get('/', (req, res) => {
    res.send('Okay Okay')
})


app.listen(Port, () => {
    console.log(`Server Started at ${Port}`)
})


/* */
