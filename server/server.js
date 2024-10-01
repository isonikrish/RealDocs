import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js'; // Assuming you have user routes set up in a separate file

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware setup
app.use(express.json()); // For parsing JSON bodies
app.use(cookieParser()); // For parsing cookies
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    origin: 'http://localhost:5173', // Adjust to your client app's URL in production
    credentials: true // Allows cookies to be sent from the frontend
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error.message);
});

// Routes setup
app.use('/api/auth', authRoutes); // Add user routes for login, signup, etc.

// Default route
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
