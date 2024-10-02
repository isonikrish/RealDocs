import express from 'express'
const router = express.Router()
import { signup, login, logout,getMe } from '../controllers/auth.js';
import { protectRoute } from '../utils/protectRoute.js';
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getme',protectRoute,getMe)
export default router;
