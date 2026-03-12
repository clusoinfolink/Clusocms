import mongoose, { Schema } from 'mongoose';

const GalleryImageSchema = new Schema({
  url:      { type: String, required: true },
  publicId: { type: String },
  caption:  { type: String },
  category: { type: String },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
