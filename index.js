const express = require('express');
const mongoDb =require('./db');
const app = express();
const userRegister= require('./routes/userRoutes')
const product=require('./routes/productRoutes')
const cors = require('cors');
require('dotenv').config();
app.use(cors({
    origin: 'http://localhost:5173', // Update this if your Vite dev server runs on a different port
    credentials: true
}));
app.use(express.json());
app.use('/api/user',userRegister);
app.use('/api/product',product);
mongoDb();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});