import mongoose, { Schema } from 'mongoose';

const ContactSubmissionSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  companyName: { type: String },
  phone:   { type: String },
  subject: { type: String },
  department: { type: String, enum: ['sales', 'hr', 'marketing', 'others'], default: 'others' },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);
