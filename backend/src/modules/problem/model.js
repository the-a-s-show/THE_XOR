import mongoose from 'mongoose';
import { DIFFICULTY } from '../utils/constants.js';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY),
      required: [true, 'Difficulty is required'],
    },
    tags: [String],
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    constraints: String,
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    test_cases: [
      {
        input: String,
        output: String,
        hidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
    starter_code: mongoose.Schema.Types.Mixed, // { python: "...", java: "...", cpp: "..." }
    hints: [String],
    editorial: String,
    video_solution_url: String,
    time_complexity: String,
    space_complexity: String,
    premium: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 10,
    },
    order: Number,
    is_published: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submission_count: {
      type: Number,
      default: 0,
    },
    accepted_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
problemSchema.index({ slug: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ is_published: 1 });
problemSchema.index({ topics: 1 });

export default mongoose.model('Problem', problemSchema);
