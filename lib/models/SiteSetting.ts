import mongoose, { Schema } from 'mongoose';

const SiteSettingSchema = new Schema({
  siteName:     { type: String, default: 'Cluso Infolink' },
  tagline:      { type: String, default: "Let's Make It Transparent" },
  heroBackgroundImage: { type: String, default: '' },
  aboutMissionImage: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address:      { type: String, default: '' },
  trustedCompanies: [{ type: String }],
  socialLinks:  {
    facebook:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
