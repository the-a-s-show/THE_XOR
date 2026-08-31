import mongoose from 'mongoose';
import { SUBMISSION_STATUS, PROGRAMMING_LANGUAGES } from '../utils/constants.js';

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
    },
    language: {
      type: String,
      enum: Object.values(PROGRAMMING_LANGUAGES),
      required: [true, 'Language is required'],
    },
    status: {
      type: String,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.ACCEPTED, // Mock responses
    },
    execution_time_ms: Number,
    memory_used_mb: Number,
    test_results: {
      passed: Number,
      total: Number,
      failed_tests: [Number],
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ user_id: 1, problem_id: 1 });
submissionSchema.index({ user_id: 1 });
submissionSchema.index({ problem_id: 1 });
submissionSchema.index({ status: 1 });

export default mongoose.model('Submission', submissionSchema);
