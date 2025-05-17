const express = require('express');
const app = express();

const authRouter = require('./Routes/AuthRouter');
app.use(express.json()); // To parse JSON bodies
app.use('/auth', authRouter);

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});