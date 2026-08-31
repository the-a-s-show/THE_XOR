import mongoose from 'mongoose';

const userStreakSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    current_streak: {
      type: Number,
      default: 0,
    },
    best_streak: {
      type: Number,
      default: 0,
    },
    last_solved_at: Date,
    problems_solved_today: {
      type: Number,
      default: 0,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserStreak', userStreakSchema);
