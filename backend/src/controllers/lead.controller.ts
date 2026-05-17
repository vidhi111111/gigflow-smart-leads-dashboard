import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { validationResult } from 'express-validator';

export const createLead = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }

  const { name, email, status, source } = req.body;

  try {
    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user.id,
    });

    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeads = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    let query: any = {};

    // For Sales User, only show their leads, Admin can see all
    if (req.user.role !== 'Admin') {
      query.createdBy = req.user.id;
    }

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortQuery: any = { createdAt: -1 }; // Default oldest
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeadById = async (req: any, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
       res.status(404).json({ message: 'Lead not found' });
       return;
    }

    if (req.user.role !== 'Admin' && lead.createdBy._id.toString() !== req.user.id) {
       res.status(403).json({ message: 'Not authorized' });
       return;
    }

    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLead = async (req: any, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
       res.status(404).json({ message: 'Lead not found' });
       return;
    }

    if (req.user.role !== 'Admin' && lead.createdBy.toString() !== req.user.id) {
       res.status(403).json({ message: 'Not authorized' });
       return;
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedLead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLead = async (req: any, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
       res.status(404).json({ message: 'Lead not found' });
       return;
    }

    if (req.user.role !== 'Admin' && lead.createdBy.toString() !== req.user.id) {
       res.status(403).json({ message: 'Not authorized' });
       return;
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
