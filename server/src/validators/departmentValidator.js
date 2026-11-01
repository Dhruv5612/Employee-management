import { z } from 'zod';
import mongoose from 'mongoose';

export const createDepartmentSchema = z.object({
  name: z
    .string({ required_error: 'Department name is required' })
    .trim()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name cannot exceed 100 characters'),
  code: z
    .string({ required_error: 'Department code is required' })
    .trim()
    .toUpperCase()
    .min(2, 'Department code must be at least 2 characters')
    .max(20, 'Department code cannot exceed 20 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),
  manager: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid manager employee ID',
    }),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const reassignEmployeesSchema = z.object({
  targetDepartmentId: z
    .string({ required_error: 'Target department ID is required' })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid target department ID',
    }),
});
