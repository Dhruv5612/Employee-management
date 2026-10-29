import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Company News', 'Urgent Notice', 'Policy Update', 'Event & Celebration'],
      default: 'Company News',
    },
    priority: {
      type: String,
      enum: ['Normal', 'High', 'Low'],
      default: 'Normal',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    targetAudience: {
      type: String,
      default: 'All Employees',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: 'Leadership Team',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

announcementSchema.index({ isPinned: -1, createdAt: -1 });

export const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;

