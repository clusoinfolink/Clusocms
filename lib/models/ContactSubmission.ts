import mongoose, { Schema } from 'mongoose';

const ContactSubmissionSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);
