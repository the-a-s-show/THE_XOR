import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    total_users: Number,
    active_users: Number,
    problems_solved: Number,
    new_registrations: Number,
    avg_session_duration_sec: Number,
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ date: -1 });

export default mongoose.model('Analytics', analyticsSchema);
