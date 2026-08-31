import mongoose from 'mongoose';

const userBookmarkSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Unique constraint: one bookmark per user per problem
userBookmarkSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });
userBookmarkSchema.index({ user_id: 1 });

export default mongoose.model('UserBookmark', userBookmarkSchema);
