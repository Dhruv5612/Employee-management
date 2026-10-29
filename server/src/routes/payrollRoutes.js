import { Router } from 'express';
import { Payroll } from '../models/Payroll.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

// Get payroll stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const records = await Payroll.find();
    const totalPayroll = records.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);
    const paidCount = records.filter((r) => r.paymentStatus === 'Paid').length;
    const pendingCount = records.filter((r) => r.paymentStatus === 'Pending' || r.paymentStatus === 'Processing').length;
    const avgSalary = records.length ? Math.round(totalPayroll / records.length) : 0;

    res.json({
      success: true,
      data: {
        totalPayroll,
        paidCount,
        pendingCount,
        avgSalary,
        totalRecords: records.length,
      },
    });
  })
);

// List payroll
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { month, year, status, q } = req.query;
    const query = {};
    if (month) query.month = month;
    if (year) query.year = Number(year);
    if (status && status !== 'All') query.paymentStatus = status;

    let records = await Payroll.find(query).sort({ createdAt: -1 });
    if (q) {
      const qLower = q.toLowerCase();
      records = records.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(qLower) ||
          r.employeeId.toLowerCase().includes(qLower) ||
          r.department.toLowerCase().includes(qLower)
      );
    }
    res.json({ success: true, data: records });
  })
);

// Create payroll (Admin/HR only)
router.post(
  '/',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const base = Number(req.body.baseSalary) || 0;
    const allow = Number(req.body.allowances) || 0;
    const deduct = Number(req.body.deductions) || 0;
    const net = base + allow - deduct;

    const record = await Payroll.create({
      ...req.body,
      baseSalary: base,
      allowances: allow,
      deductions: deduct,
      netSalary: net,
    });
    res.status(201).json({ success: true, data: record });
  })
);

// Update status
router.patch(
  '/:id/status',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const record = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: record });
  })
);

// Delete payroll
router.delete(
  '/:id',
  authorize('Admin'),
  asyncHandler(async (req, res) => {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payroll record deleted' });
  })
);

export default router;

