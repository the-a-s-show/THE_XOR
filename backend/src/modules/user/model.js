import mongoose from 'mongoose';
import { ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
    },
    bio: String,
    avatar_url: String,
    company: String,
    skills: [String],
    github_url: String,
    linkedin_url: String,
    leetcode_handle: String,
    codeforces_handle: String,
    codechef_handle: String,
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    rating: {
      type: Number,
      default: 1000,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    coins: {
      type: Number,
      default: 0,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
      },
    ],
    preferences: {
      theme: {
        type: String,
        default: 'dark',
        enum: ['light', 'dark'],
      },
      notifications_enabled: {
        type: Boolean,
        default: true,
      },
      email_notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ rating: -1 });

// Virtual for solved problems count
userSchema.virtual('problems_solved').get(function () {
  return 0; // Will be populated from UserProgress
});

// Hide password in JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
