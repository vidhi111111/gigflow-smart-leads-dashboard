import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import { protect } from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    [
      body('name').notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('status').isIn(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
      body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
    ],
    createLead
  )
  .get(getLeads);

router
  .route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

export default router;
