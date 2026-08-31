import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
    },
    description: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Badge', badgeSchema);
