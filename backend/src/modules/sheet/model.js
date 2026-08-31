import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sheet name is required'],
    },
    description: String,
    problem_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    is_public: {
      type: Boolean,
      default: true,
    },
    total_problems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

sheetSchema.index({ created_by: 1 });
sheetSchema.index({ is_public: 1 });

export default mongoose.model('Sheet', sheetSchema);
