import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js'; 
import http from 'http';
import { Server } from 'socket.io';
import Doc from './models/doc.js';
import docRoutes from './routes/doc.js';
import User from './models/user.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Your frontend's URL
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
app.use('/api/doc', docRoutes);
io.on('connection', (socket) => {
    socket.on('join-document', async ({ docId, user }) => {
        try {
            // Make sure user and user._id exist
            if (!user || !user._id) {
                return socket.emit('error', 'User information is missing.');
            }

            // Join the document room
            socket.join(docId);
            socket.to(docId).emit('user-joined', user?.email);

            // Load the document from the database or create it if it doesn't exist
            let doc = await Doc.findById(docId);
            if (!doc) {
                // Create a new document if it doesn't exist
                doc = new Doc({
                    title: 'Untitled',
                    content: '',
                    _id: docId,
                    user: user._id, // Ensure user._id is passed correctly here
                });

                await doc.save();

                // Push the document ID to the user's docs array and update the user
                await User.findByIdAndUpdate(user._id, {
                    $push: { docs: doc._id } // Use $push to add the doc to the user's array
                });

                socket.broadcast.to(docId).emit('load-document', doc.content, doc.title, doc._id);
            } else {
                // If the document exists, load it for the user
                socket.emit('load-document', doc.content, doc.title, doc._id);
            }

            // Listen for changes in content or title and broadcast to other users
            socket.on('send-changes', (content, title) => {
                socket.broadcast.to(docId).emit('receive-changes', content, title);
            });

            // Save the document when requested
            socket.on('save-document', async ({ docId, content, title }) => {
                await Doc.findByIdAndUpdate(docId, { content, title });
            });
        } catch (error) {
            console.error('Error handling document join:', error);
            socket.emit('error', 'An error occurred while joining the document.');
        }
    });

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
