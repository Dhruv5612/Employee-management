import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
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
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Processing', 'Pending'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Direct Deposit', 'Bank Transfer', 'Cheque', 'Cash'],
      default: 'Direct Deposit',
    },
    paymentDate: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

payrollSchema.index({ month: 1, year: 1, paymentStatus: 1 });

export const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;

