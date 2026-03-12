import mongoose, { Schema } from 'mongoose';

const NoticeSchema = new Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  date:     { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  active:   { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
