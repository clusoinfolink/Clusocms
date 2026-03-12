import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String },
  image:       { type: String },
  features:    [String],
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
