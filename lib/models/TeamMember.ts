import mongoose, { Schema } from 'mongoose';

const TeamMemberSchema = new Schema({
  name:    { type: String, required: true },
  role:    { type: String, required: true },
  photo:   { type: String },
  bio:     { type: String },
  email:   { type: String },
  phone:   { type: String },
  order:   { type: Number, default: 0 },
  socials: {
    linkedin:  String,
    facebook:  String,
    twitter:   String,
    youtube:   String,
    instagram: String,
  },
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
