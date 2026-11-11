import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ProfileFields, UpdateProfilePayload } from '../../types/profile';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TEXT_FIELDS = [
  ['displayName', 'Display name'],
  ['headline', 'Headline'],
  ['pronouns', 'Pronouns'],
  ['jobTitle', 'Job title'],
  ['company', 'Company'],
  ['location', 'Location'],
] as const;

const URL_FIELDS = [
  ['website', 'Website'],
  ['twitter', 'X / Twitter'],
  ['github', 'GitHub'],
  ['linkedin', 'LinkedIn'],
  ['medium', 'Medium'],
  ['youtube', 'YouTube'],
  ['instagram', 'Instagram'],
] as const;

type TextKey =
  | (typeof TEXT_FIELDS)[number][0]
  | (typeof URL_FIELDS)[number][0]
  | 'bio'
  | 'interests'
  | 'skills';
type FormState = Record<TextKey, string> & { availableForWork: boolean };

// Every input is a string; lists are typed as "a, b, c"
const toForm = (p: ProfileFields | null): FormState => ({
  displayName: p?.displayName ?? '',
  headline: p?.headline ?? '',
  pronouns: p?.pronouns ?? '',
  jobTitle: p?.jobTitle ?? '',
  company: p?.company ?? '',
  location: p?.location ?? '',
  bio: p?.bio ?? '',
  website: p?.website ?? '',
  twitter: p?.twitter ?? '',
  github: p?.github ?? '',
  linkedin: p?.linkedin ?? '',
  medium: p?.medium ?? '',
  youtube: p?.youtube ?? '',
  instagram: p?.instagram ?? '',
  interests: p?.interests.join(', ') ?? '',
  skills: p?.skills.join(', ') ?? '',
  availableForWork: p?.availableForWork ?? false,
});

const toList = (text: string) =>
  text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

interface ProfileFormProps {
  profile: ProfileFields | null;
  saving: boolean;
  onSave: (payload: UpdateProfilePayload) => void;
}

export default function ProfileForm({
  profile,
  saving,
  onSave,
}: ProfileFormProps) {
  const [form, setForm] = useState(() => toForm(profile));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Empty strings are sent as-is; the backend turns them into null (cleared)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...form,
      interests: toList(form.interests),
      skills: toList(form.skills),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-white/10 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map(([name, label]) => (
          <Input
            key={name}
            label={label}
            name={name}
            value={form[name]}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="text-left">
        <label htmlFor="bio" className="text-sm font-medium text-zinc-300">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={1000}
          value={form.bio}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950/60 px-3.5 py-2.5 text-sm focus:border-indigo-400/60 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Interests"
          name="interests"
          placeholder="AI, music, travel"
          value={form.interests}
          onChange={handleChange}
        />
        <Input
          label="Skills"
          name="skills"
          placeholder="React, NestJS"
          value={form.skills}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {URL_FIELDS.map(([name, label]) => (
          <Input
            key={name}
            label={label}
            name={name}
            type="url"
            placeholder="https://…"
            value={form[name]}
            onChange={handleChange}
          />
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.availableForWork}
          onChange={(e) =>
            setForm({ ...form, availableForWork: e.target.checked })
          }
        />
        Available for work
      </label>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  );
}
