import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: [true, 'Comment content is required'],
    },
    is_solution: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    deleted_at: Date, // For soft delete
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ problem_id: 1, deleted_at: 1 });
commentSchema.index({ user_id: 1 });
commentSchema.index({ parent_comment_id: 1 });

export default mongoose.model('Comment', commentSchema);
