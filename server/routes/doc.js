import express from 'express';
import {  getDoc, deleteDoc } from '../controllers/doc.js'; 

import {protectRoute} from '../utils/protectRoute.js';
const router = express.Router();

router.get('/get', protectRoute, getDoc);
router.delete('/:id', protectRoute, deleteDoc);

export default router;
