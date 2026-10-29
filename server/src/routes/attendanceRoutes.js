import { Router } from 'express';
import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate);

// Get attendance stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: targetDate });

    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const onLeave = records.filter((r) => r.status === 'On Leave').length;
    const halfDay = records.filter((r) => r.status === 'Half Day').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const total = records.length;
    const rate = total > 0 ? Math.round(((present + halfDay) / total) * 100) : 100;

    res.json({
      success: true,
      data: {
        total,
        present,
        absent,
        onLeave,
        halfDay,
        late,
        rate,
      },
    });
  })
);

// List attendance for date
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    let records = await Attendance.find({ date: targetDate });

    // If no records exist for this day yet, auto-populate from active employees
    if (records.length === 0) {
      const emps = await Employee.find({ status: 'Active' }).populate('department');
      if (emps.length > 0) {
        const toCreate = emps.map((emp) => ({
          employeeId: emp.employeeId,
          employeeName: emp.fullName,
          department: emp.department?.name || 'General',
          date: targetDate,
          status: 'Present',
          checkIn: '09:00 AM',
          checkOut: '05:30 PM',
          notes: '',
        }));
        records = await Attendance.insertMany(toCreate);
      }
    }

    res.json({ success: true, data: records });
  })
);

// Update single attendance
router.patch(
  '/:id',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: record });
  })
);

// Batch mark attendance
router.post(
  '/batch',
  authorize('Admin', 'HR'),
  asyncHandler(async (req, res) => {
    const { date, status } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const checkIn = status === 'Present' ? '09:00 AM' : '-';
    const checkOut = status === 'Present' ? '05:30 PM' : '-';

    await Attendance.updateMany({ date: targetDate }, { $set: { status, checkIn, checkOut } });
    const updated = await Attendance.find({ date: targetDate });
    res.json({ success: true, data: updated });
  })
);

export default router;

