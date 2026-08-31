import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      unique: true,
    },
    description: String,
    icon: String, // emoji or URL
    problem_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

topicSchema.index({ name: 1 });

export default mongoose.model('Topic', topicSchema);
