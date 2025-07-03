const express = require('express');
const mongoDb =require('./db');
const app = express();
const userRegister= require('./routes/userRoutes')
const product=require('./routes/productRoutes')
require('dotenv').config();
app.use(express.json());
app.use('/api/user',userRegister);
app.use('/api/product',product);
mongoDb();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
