const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { DBConnection } = require('./Models/db');
const Router = require('./Routes/Router');

DBConnection();

const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res) => {
  res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', Router); 
app.use('/contribute', Router); 
app.use('/enquiry', Router);
app.use('/report', Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})