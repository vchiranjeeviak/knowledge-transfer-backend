require('dotenv').config();
const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user');
const productRoutes = require('./Routes/product');
const orderRoutes = require('./Routes/order');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongoURI);
        console.log('DB connected.');
    }
    catch (e) {
        console.log('DB not connected');
        console.log(e);
    }
}

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})