import mongoose from 'mongoose';
import { ANNOUNCEMENT_TYPE } from '../utils/constants.js';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    type: {
      type: String,
      enum: Object.values(ANNOUNCEMENT_TYPE),
      default: ANNOUNCEMENT_TYPE.INFO,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expires_at: Date,
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ created_at: -1 });
announcementSchema.index({ expires_at: 1 });

export default mongoose.model('Announcement', announcementSchema);
