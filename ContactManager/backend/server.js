require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Debugging: Check if the password is actually loaded now
console.log("Debug - Mongo URI is:", process.env.MONGO_URI);

// Import your database connection logic
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(express.json());
// 1. Fix CORS: Allow specific origins or all origins
app.use(cors({ origin: '*', credentials: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
