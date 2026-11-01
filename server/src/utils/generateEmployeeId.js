import { Counter } from '../models/Counter.js';

export async function generateEmployeeId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'employeeId' },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!counter) {
    throw new Error('Unable to generate employee ID');
  }

  return `EMP-${String(counter.sequence).padStart(6, '0')}`;
}
