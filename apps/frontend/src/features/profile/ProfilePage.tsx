import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileForm from '../../components/profile/ProfileForm';
import Button from '../../components/ui/Button';
import FormMessage from '../../components/ui/FormMessage';
import PageLoader from '../../components/ui/PageLoader';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
} from '../../store/profile/profileThunks';
import { APP_NAME } from '../../utils/helpers';

// /:name — anyone can view it; the owner also gets the edit form and picture upload
export default function ProfilePage() {
  const { name = '' } = useParams();
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);
  const { data, loading, saving, error, notice } = useAppSelector(
    (s) => s.profile,
  );
  const [editing, setEditing] = useState(false);
  const isOwner = me?.name === name;

  useEffect(() => {
    void dispatch(fetchProfile(name));
  }, [dispatch, name]);

  if (loading) return <PageLoader />;

  return (
    <section className="mx-auto max-w-3xl space-y-4 px-4 pt-20 pb-10">
      <title>{`${name} — ${APP_NAME}`}</title>

      {data && (
        <ProfileCard
          data={data}
          onUpload={
            isOwner ? (file) => void dispatch(uploadAvatar(file)) : undefined
          }
          uploading={saving}
        />
      )}
      <FormMessage message={error} />
      <FormMessage message={notice} tone="success" />

      {data &&
        isOwner &&
        (editing ? (
          <ProfileForm
            profile={data.profile}
            saving={saving}
            onSave={(payload) => void dispatch(updateProfile(payload))}
          />
        ) : (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit profile
          </Button>
        ))}
    </section>
  );
}
