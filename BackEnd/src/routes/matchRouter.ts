import express from 'express';
import { createMatch, getUserMatchHistoryByUserId } from '../controllers/matchController';
import { checkJwt } from '../auth/auth';

const router = express.Router();
router.post('/match/create', checkJwt, createMatch);
router.get('/match/history/:userId', checkJwt, getUserMatchHistoryByUserId);
export default router;