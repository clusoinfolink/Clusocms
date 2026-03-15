import mongoose, { Schema } from 'mongoose';

const AccountRequestSchema = new Schema(
  {
    companyName: String,
    companyAddress1: String,
    companyAddress2: String,
    companyCity: String,
    companyState: String,
    companyPin: String,
    companyCountry: String,
    gstin: String,
    cin: String,
    companyDocumentName: String,
    companyDocumentId: { type: Schema.Types.ObjectId, ref: 'AccountRequestDocument', default: null },
    companyDocumentNames: [String],
    companyDocumentIds: [{ type: Schema.Types.ObjectId, ref: 'AccountRequestDocument' }],

    billingSameAsCompany: Boolean,
    invoiceEmail: String,
    billingAddress1: String,
    billingAddress2: String,
    billingCity: String,
    billingState: String,
    billingPin: String,
    billingCountry: String,

    firstName: String,
    lastName: String,
    designation: String,
    contactEmail: String,
    officePhone: String,
    mobileNumber: String,
    whatsappNumber: String,

    heardAbout: String,
    referredBy: String,
    backgroundsPerYear: String,
    promoCode: String,
    industry: String,

    checks: [String],
    customRequirements: String,
    requirementDocumentName: String,
    requirementDocumentId: { type: Schema.Types.ObjectId, ref: 'AccountRequestDocument', default: null },
    requirementDocumentNames: [String],
    requirementDocumentIds: [{ type: Schema.Types.ObjectId, ref: 'AccountRequestDocument' }],

    submissionType: { type: String, enum: ['draft', 'submitted'], default: 'submitted', index: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

AccountRequestSchema.index({ createdAt: -1 });

export default mongoose.models.AccountRequest || mongoose.model('AccountRequest', AccountRequestSchema);
