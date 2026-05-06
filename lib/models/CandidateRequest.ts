import mongoose, { Schema } from 'mongoose';

const CandidateRequestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobPost' },
    jobTitle: { type: String },
    jobColor: { type: String },
    resumeDocumentId: { type: Schema.Types.ObjectId, ref: 'CandidateRequestDocument', required: true },
    resumeFileName: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CandidateRequestSchema.index({ createdAt: -1 });

export default mongoose.models.CandidateRequest || mongoose.model('CandidateRequest', CandidateRequestSchema);
