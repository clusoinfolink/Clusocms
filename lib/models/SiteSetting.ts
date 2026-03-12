import mongoose, { Schema } from 'mongoose';

const SiteSettingSchema = new Schema({
  siteName:     { type: String, default: 'Cluso Infolink' },
  tagline:      { type: String, default: "Let's Make It Transparent" },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address:      { type: String, default: '' },
  socialLinks:  {
    facebook:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
