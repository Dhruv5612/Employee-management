import { z } from 'zod';
import mongoose from 'mongoose';

const phoneRegex = /^[+]?[\d\s().-]{7,25}$/;

export const createEmployeeSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(254, 'Email cannot exceed 254 characters'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(phoneRegex, 'Invalid phone number format')
    .max(20, 'Phone number cannot exceed 20 characters'),
  department: z
    .string({ required_error: 'Department is required' })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid department ID',
    }),
  designation: z
    .string({ required_error: 'Designation is required' })
    .trim()
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation cannot exceed 100 characters'),
  joiningDate: z
    .string({ required_error: 'Joining date is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid joining date format' })
    .refine(
      (val) => {
        const d = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return d <= today;
      },
      { message: 'Joining date cannot be in the future' }
    ),
  status: z
    .enum(['Active', 'Inactive', 'On Leave'], {
      errorMap: () => ({ message: 'Status must be Active, Inactive, or On Leave' }),
    })
    .default('Active'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['Active', 'Inactive', 'On Leave'], {
    errorMap: () => ({ message: 'Status must be Active, Inactive, or On Leave' }),
  }),
});
