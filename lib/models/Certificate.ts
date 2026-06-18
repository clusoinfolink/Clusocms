import mongoose, { Schema } from 'mongoose';

const CertificateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    category: { type: String },
    recipientId: { type: String },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    recipientDesignation: { type: String },
    respondentName: { type: String },
    respondentRole: { type: String },
    respondentDepartment: { type: String },
    dateFrom: { type: String },
    dateTo: { type: String },
    remarks: { type: String },
    template: { type: String },
    createdAt: { type: String },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
