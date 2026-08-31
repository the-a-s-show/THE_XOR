import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
    },
    entity_type: {
      type: String,
      required: [true, 'Entity type is required'],
    },
    entity_id: mongoose.Schema.Types.Mixed,
    changes: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

adminLogSchema.index({ admin_id: 1 });
adminLogSchema.index({ entity_type: 1 });
adminLogSchema.index({ createdAt: -1 });

export default mongoose.model('AdminLog', adminLogSchema);
