import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
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
    solved: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    best_time_ms: Number,
    best_memory_mb: Number,
    solved_at: Date,
    last_attempted_at: Date,
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one record per user per problem
userProgressSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });
userProgressSchema.index({ user_id: 1, solved: 1 });

export default mongoose.model('UserProgress', userProgressSchema);
