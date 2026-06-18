import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, required: true },
}, { timestamps: true, collection: 'cmsadmins' });

export default mongoose.models.CmsAdmin || mongoose.model('CmsAdmin', AdminSchema, 'cmsadmins');
