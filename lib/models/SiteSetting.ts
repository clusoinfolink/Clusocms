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
  serviceCountries: { type: [String], default: ['Global', 'United Kingdom', 'Australia', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Fiji', 'India', 'Indonesia', 'Japan', 'Kiribati', 'Laos', 'Malaysia', 'Maldives', 'Marshall Islands', 'Micronesia', 'Mongolia', 'Myanmar', 'Nauru', 'Nepal', 'New Zealand', 'North Korea', 'Pakistan', 'Palau', 'Papua New Guinea', 'Philippines', 'Samoa', 'Singapore', 'Solomon Islands', 'South Korea', 'Sri Lanka', 'Taiwan', 'Thailand', 'Timor-Leste', 'Tonga', 'Tuvalu', 'Vanuatu', 'Vietnam'] },
  socialLinks:  {
    facebook:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
