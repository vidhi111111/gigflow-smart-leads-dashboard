import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  registerUser
);

router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

export default router;
