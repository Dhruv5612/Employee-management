import { Router } from 'express';
import { Announcement } from '../models/Announcement.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

// List announcements (Visible to all authenticated employees)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, q } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    let items = await Announcement.find(query).sort({ isPinned: -1, createdAt: -1 });
    if (q) {
      const qLower = q.toLowerCase();
      items = items.filter(
        (a) => a.title.toLowerCase().includes(qLower) || a.content.toLowerCase().includes(qLower)
      );
    }
    res.json({ success: true, data: items });
  })
);

// Create announcement (Admin & HR only)
router.post(
  '/',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.create({
      ...req.body,
      author: req.body.author || req.user.name,
    });
    res.status(201).json({ success: true, data: announcement });
  })
);

// Delete announcement (Admin & HR only)
router.delete(
  '/:id',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  })
);

export default router;

