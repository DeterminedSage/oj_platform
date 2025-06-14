const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const { executeCode } = require("./executeCode");
const { DBConnection } = require('./Models/db');
const AuthRouter = require('./Routes/AuthRouter');
const CrudRouter = require('./Routes/CrudRouter');
const ProfileRouter = require('./Routes/ProfileRouter');
const CodeRouter = require('./Routes/CodeRouter');

DBConnection();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', AuthRouter); 
app.use('/crud',CrudRouter);
app.use('/profile',ProfileRouter);
app.use('/code',CodeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})