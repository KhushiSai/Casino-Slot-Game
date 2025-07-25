require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = require('./config/db');
const routes = require('./routes');

connectDB();

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 