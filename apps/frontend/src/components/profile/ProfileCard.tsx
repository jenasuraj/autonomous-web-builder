import {
  Briefcase,
  Building2,
  Camera,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { ProfileResponse } from '../../types/profile';
import { getInitials } from '../../utils/helpers';

const LINKS = [
  ['website', 'Website'],
  ['twitter', 'X / Twitter'],
  ['github', 'GitHub'],
  ['linkedin', 'LinkedIn'],
  ['medium', 'Medium'],
  ['youtube', 'YouTube'],
  ['instagram', 'Instagram'],
] as const;

interface ProfileCardProps {
  data: ProfileResponse;
  onUpload?: (file: File) => void; // only passed on your own profile
  uploading?: boolean;
}

export default function ProfileCard({
  data,
  onUpload,
  uploading,
}: ProfileCardProps) {
  const { name, avatarUrl, profile: p } = data;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
    e.target.value = ''; // lets you pick the same file again
  };

  const lists = [
    { label: 'Interests', items: p?.interests ?? [] },
    { label: 'Skills', items: p?.skills ?? [] },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-white/10 p-6">
      <div className="flex items-center gap-5">
        <div className="relative size-24 shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-24 place-items-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 text-2xl font-semibold">
              {getInitials(p?.displayName ?? name)}
            </span>
          )}
          {onUpload && (
            <label
              aria-label="Change picture"
              className="absolute right-0 bottom-0 grid size-8 cursor-pointer place-items-center rounded-full border border-white/10 bg-zinc-900 hover:bg-zinc-800"
            >
              <Camera className="size-4" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleFile}
              />
            </label>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{p?.displayName ?? name}</h1>
          <p className="text-sm text-zinc-400">
            @{name}
            {p?.pronouns && ` · ${p.pronouns}`}
          </p>
          {p?.headline && <p className="mt-1 text-zinc-300">{p.headline}</p>}
          {p?.availableForWork && (
            <span className="mt-2 inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-300">
              Available for work
            </span>
          )}
        </div>
      </div>

      {!p && (
        <p className="text-sm text-zinc-500">This profile is empty for now.</p>
      )}

      {p?.bio && <p className="whitespace-pre-wrap text-zinc-300">{p.bio}</p>}

      {p && (p.jobTitle || p.company || p.location) && (
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          {p.jobTitle && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" /> {p.jobTitle}
            </span>
          )}
          {p.company && (
            <span className="flex items-center gap-1.5">
              <Building2 className="size-4" /> {p.company}
            </span>
          )}
          {p.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {p.location}
            </span>
          )}
        </div>
      )}

      {lists.map(
        ({ label, items }) =>
          items.length > 0 && (
            <div key={label}>
              <h2 className="mb-2 text-sm font-medium text-zinc-400">
                {label}
              </h2>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/5 px-3 py-1 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ),
      )}

      {p && (
        <div className="flex flex-wrap gap-2">
          {LINKS.map(
            ([key, label]) =>
              p[key] && (
                <a
                  key={key}
                  href={p[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
                >
                  {label} <ExternalLink className="size-3.5" />
                </a>
              ),
          )}
        </div>
      )}
    </div>
  );
}
