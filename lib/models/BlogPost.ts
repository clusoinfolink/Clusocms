import mongoose, { Schema } from 'mongoose';

const BlogPostSchema = new Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true, index: true },
  content:    { type: String, required: true },
  excerpt:    { type: String },
  author:     { type: String, default: 'cluso' },
  category:   { type: String, index: true },
  coverImage: { type: String },
  published:  { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
