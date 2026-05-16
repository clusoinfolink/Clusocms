'use client';

import { useEffect, useState } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface Settings {
  siteName: string;
  tagline: string;
  heroBackgroundImage: string;
  aboutMissionImage: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  trustedCompanies: string[];
  serviceCountries: string[];
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [form, setForm] = useState<Settings>({
    siteName: '',
    tagline: '',
    heroBackgroundImage: '',
    aboutMissionImage: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    trustedCompanies: [],
    serviceCountries: [],
    socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' },
  });

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setForm({
          siteName: data.siteName || '',
          tagline: data.tagline || '',
          heroBackgroundImage: data.heroBackgroundImage || '',
          aboutMissionImage: data.aboutMissionImage || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          trustedCompanies: Array.isArray(data.trustedCompanies)
            ? data.trustedCompanies.filter((item: unknown): item is string => typeof item === 'string')
            : [],
          serviceCountries: Array.isArray(data.serviceCountries)
            ? data.serviceCountries.filter((item: unknown): item is string => typeof item === 'string')
            : [],
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            twitter: data.socialLinks?.twitter || '',
            linkedin: data.socialLinks?.linkedin || '',
            instagram: data.socialLinks?.instagram || '',
          },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSocial(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
  }

  function addCompany() {
    const company = companyInput.trim();
    if (!company) return;

    const alreadyExists = form.trustedCompanies.some(
      (item) => item.toLowerCase() === company.toLowerCase()
    );
    if (alreadyExists) {
      setCompanyInput('');
      return;
    }

    setForm((prev) => ({ ...prev, trustedCompanies: [...prev.trustedCompanies, company] }));
    setCompanyInput('');
  }

  function removeCompany(index: number) {
    setForm((prev) => ({
      ...prev,
      trustedCompanies: prev.trustedCompanies.filter((_, i) => i !== index),
    }));
  }

  function addCountry() {
    const country = countryInput.trim();
    if (!country) return;

    const alreadyExists = form.serviceCountries.some(
      (item) => item.toLowerCase() === country.toLowerCase()
    );
    if (alreadyExists) {
      setCountryInput('');
      return;
    }

    setForm((prev) => ({ ...prev, serviceCountries: [...prev.serviceCountries, country] }));
    setCountryInput('');
  }

  function removeCountry(index: number) {
    setForm((prev) => ({
      ...prev,
      serviceCountries: prev.serviceCountries.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to save settings');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <GlassCard>
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">General</h2>
          <div className="space-y-4">
            <GlassInput label="Site Name" name="siteName" value={form.siteName} onChange={handleChange} required />
            <GlassInput label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Background Image</label>
              <ImageUploader
                value={form.heroBackgroundImage}
                onChange={(url) => setForm((prev) => ({ ...prev, heroBackgroundImage: url }))}
                folder="cluso/hero"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Mission Image</label>
              <ImageUploader
                value={form.aboutMissionImage}
                onChange={(url) => setForm((prev) => ({ ...prev, aboutMissionImage: url }))}
                folder="cluso/about"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Email" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} />
              <GlassInput label="Phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trusted Companies
              </label>
              <div className="flex gap-2">
                <GlassInput
                  placeholder="Add company name"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCompany();
                    }
                  }}
                />
                <GlassButton type="button" variant="secondary" onClick={addCompany}>
                  Add
                </GlassButton>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {form.trustedCompanies.length === 0 ? (
                  <p className="text-sm text-gray-500">No companies added yet.</p>
                ) : (
                  form.trustedCompanies.map((company, index) => (
                    <div
                      key={`${company}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                    >
                      <span>{company}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${company}`}
                        className="rounded-full px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => removeCompany(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Countries
              </label>
              <div className="flex gap-2">
                <GlassInput
                  placeholder="Add country"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCountry();
                    }
                  }}
                />
                <GlassButton type="button" variant="secondary" onClick={addCountry}>
                  Add
                </GlassButton>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {form.serviceCountries.length === 0 ? (
                  <p className="text-sm text-gray-500">No countries added yet.</p>
                ) : (
                  form.serviceCountries.map((country, index) => (
                    <div
                      key={`country-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                    >
                      <span>{country}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${country}`}
                        className="rounded-full px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => removeCountry(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Social Links</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Facebook" name="facebook" value={form.socialLinks.facebook} onChange={handleSocial} />
              <GlassInput label="Twitter" name="twitter" value={form.socialLinks.twitter} onChange={handleSocial} />
              <GlassInput label="LinkedIn" name="linkedin" value={form.socialLinks.linkedin} onChange={handleSocial} />
              <GlassInput label="Instagram" name="instagram" value={form.socialLinks.instagram} onChange={handleSocial} />
            </div>
          </div>
        </GlassCard>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">Settings saved successfully!</div>
        )}

        <GlassButton type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </GlassButton>
      </form>
    </div>
  );
}
