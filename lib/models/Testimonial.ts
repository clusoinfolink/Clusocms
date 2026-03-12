import mongoose, { Schema } from 'mongoose';

const TestimonialSchema = new Schema({
  name:    { type: String, required: true },
  company: { type: String },
  role:    { type: String },
  quote:   { type: String, required: true },
  avatar:  { type: String },
  rating:  { type: Number, min: 1, max: 5 },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
