import mongoose from 'mongoose';
import { NOTIFICATION_TYPE } from '../utils/constants.js';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      default: NOTIFICATION_TYPE.INFO,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user_id: 1, read: 1 });
notificationSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
