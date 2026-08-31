import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Achievement name is required'],
      unique: true,
    },
    description: String,
    icon: String,
    criteria: String,
    reward_xp: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Achievement', achievementSchema);
