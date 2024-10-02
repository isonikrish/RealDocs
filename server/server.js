import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js'; 
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Your frontend's URL
        methods: ['GET', 'POST'],
        credentials: true, // Allow credentials (cookies) to be passed
    },
});

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
app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
    socket.on('join-document',async (documentId)=>{
        socket.join(documentId);

        socket.on('send-changes', (changes) => {
            socket.broadcast.to(documentId).emit('receive-changes', changes);
        });
        socket.on('load-document', async (docContent) => {
            socket.broadcast.to(documentId).emit('load-document', docContent);
        });
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
app.get('/', (req, res) => {
    res.send('Hello World');
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
