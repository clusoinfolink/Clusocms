import mongoose, { Schema } from 'mongoose';

const CandidateRequestDocumentSchema = new Schema(
  {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

CandidateRequestDocumentSchema.index({ createdAt: -1 });

export default mongoose.models.CandidateRequestDocument
  || mongoose.model('CandidateRequestDocument', CandidateRequestDocumentSchema);
