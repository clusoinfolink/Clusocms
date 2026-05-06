import mongoose, { Schema } from 'mongoose';

const JobPostSchema = new Schema({
  title:        { type: String, required: true },
  slug:         { type: String, required: true, unique: true, index: true },
  content:      { type: String, required: true },
  excerpt:      { type: String },
  department:   { type: String, default: 'General' },
  location:     { type: String, default: 'Remote' },
  type:         { type: String, default: 'Full-time' },
  coverImage:   { type: String },
  primaryColor: { type: String, default: '#0052cc' },
  published:    { type: Boolean, default: false, index: true },
}, { timestamps: true });

JobPostSchema.index({ published: 1, createdAt: -1 });

export default mongoose.models.JobPost || mongoose.model('JobPost', JobPostSchema);
