import mongoose, { Schema } from 'mongoose';

const VerificationLogSchema = new Schema(
  {
    certificateId: { type: String, required: true, index: true },
    verifierCompany: { type: String, required: true, trim: true },
    verifierName: { type: String, required: true, trim: true },
    verifierEmail: { type: String, required: true, trim: true, lowercase: true },
    verifierPhone: { type: String, required: true, trim: true },
    useCase: { type: String, required: true, trim: true },
    cin: { type: String, trim: true },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VerificationLogSchema.index({ certificateId: 1, createdAt: -1 });

export default mongoose.models.VerificationLog || mongoose.model('VerificationLog', VerificationLogSchema);
