import mongoose from 'mongoose';
import { CONTEST_STATUS } from '../utils/constants.js';

const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contest name is required'],
    },
    description: String,
    problem_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    start_time: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    end_time: {
      type: Date,
      required: [true, 'End time is required'],
    },
    duration_minutes: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    max_participants: Number,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(CONTEST_STATUS),
      default: CONTEST_STATUS.UPCOMING,
    },
  },
  {
    timestamps: true,
  }
);

contestSchema.index({ start_time: 1 });
contestSchema.index({ status: 1 });
contestSchema.index({ created_by: 1 });

export default mongoose.model('Contest', contestSchema);
