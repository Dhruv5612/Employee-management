import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false,
    },
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
    employeeEmail: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    leaveType: {
      type: String,
      enum: ['Casual Leave', 'Sick Leave', 'Annual Vacation', 'Emergency Leave', 'Medical Leave', 'Maternity/Paternity'],
      default: 'Casual Leave',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    appliedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    reviewedBy: {
      type: String,
      trim: true,
      default: null,
    },
    reviewComment: {
      type: String,
      trim: true,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

leaveRequestSchema.index({ status: 1, createdAt: -1 });

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;

