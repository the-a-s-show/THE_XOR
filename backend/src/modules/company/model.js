import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
    },
    logo_url: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 1 });

export default mongoose.model('Company', companySchema);
