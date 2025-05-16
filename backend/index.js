const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { DBConnection } = require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');

DBConnection();

const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res) => {
  res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('./auth',AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})