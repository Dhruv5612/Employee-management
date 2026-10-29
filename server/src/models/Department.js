import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ code: 1 }, { unique: true });

export const Department = mongoose.model('Department', departmentSchema);
export default Department;
