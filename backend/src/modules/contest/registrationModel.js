import mongoose from 'mongoose';

const contestRegistrationSchema = new mongoose.Schema(
  {
    contest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registered_at: {
      type: Date,
      default: Date.now,
    },
    started_at: Date,
    finished_at: Date,
  },
  {
    timestamps: true,
  }
);

contestRegistrationSchema.index({ contest_id: 1, user_id: 1 }, { unique: true });
contestRegistrationSchema.index({ contest_id: 1 });
contestRegistrationSchema.index({ user_id: 1 });

export default mongoose.model('ContestRegistration', contestRegistrationSchema);
