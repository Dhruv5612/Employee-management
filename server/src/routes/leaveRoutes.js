import { Router } from 'express';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

// Get leave stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const leaves = await LeaveRequest.find();
    const pending = leaves.filter((l) => l.status === 'Pending').length;
    const approved = leaves.filter((l) => l.status === 'Approved').length;
    const rejected = leaves.filter((l) => l.status === 'Rejected').length;

    res.json({
      success: true,
      data: {
        pending,
        approved,
        rejected,
        total: leaves.length,
      },
    });
  })
);

// List leaves
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  })
);

// Create leave
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json({ success: true, data: leave });
  })
);

// Update status (Admin/HR only)
router.patch(
  '/:id/status',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const { status, reviewComment, reviewedBy } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewComment,
        reviewedBy: reviewedBy || req.user.name,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    res.json({ success: true, data: leave });
  })
);

export default router;

