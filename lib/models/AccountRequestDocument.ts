import mongoose, { Schema } from 'mongoose';

const AccountRequestDocumentSchema = new Schema(
  {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
    kind: { type: String, enum: ['company', 'requirement'], required: true },
  },
  { timestamps: true }
);

AccountRequestDocumentSchema.index({ createdAt: -1 });

export default mongoose.models.AccountRequestDocument || mongoose.model('AccountRequestDocument', AccountRequestDocumentSchema);
