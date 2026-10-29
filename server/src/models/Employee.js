import mongoose from 'mongoose';

export const EMPLOYMENT_STATUSES = ['Active', 'Inactive', 'On Leave'];

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    joiningDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          // Allow today, reject future dates
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return date <= today;
        },
        message: 'Joining date cannot be in the future',
      },
    },
    status: {
      type: String,
      enum: EMPLOYMENT_STATUSES,
      default: 'Active',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ fullName: 1 });
employeeSchema.index({ joiningDate: -1 });

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
