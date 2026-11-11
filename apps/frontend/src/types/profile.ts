export interface ProfileFields {
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  jobTitle: string | null;
  pronouns: string | null;
  availableForWork: boolean;
  interests: string[];
  skills: string[];
  website: string | null;
  twitter: string | null;
  github: string | null;
  linkedin: string | null;
  medium: string | null;
  youtube: string | null;
  instagram: string | null;
}

// GET /api/profile/:name. profile is null until the user edits it once
export interface ProfileResponse {
  name: string;
  avatarUrl: string | null;
  profile: ProfileFields | null;
}

export type UpdateProfilePayload = Partial<ProfileFields>;
