import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Late', 'On Leave'],
      default: 'Present',
    },
    checkIn: {
      type: String,
      default: '-',
    },
    checkOut: {
      type: String,
      default: '-',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

attendanceSchema.index({ date: 1, employeeId: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;

