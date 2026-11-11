import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import type {
  ProfileResponse,
  UpdateProfilePayload,
} from '../../types/profile';
import { getErrorMessage } from '../../utils/helpers';
import type { RootState } from '../index';

const thunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: string;
}>();

// Anyone's profile, by the name in the url
export const fetchProfile = thunk(
  'profile/fetch',
  async (name: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ProfileResponse>(`/profile/${name}`);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// Your own profile; the backend knows who you are from the cookie
export const updateProfile = thunk(
  'profile/update',
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<ProfileResponse>('/profile', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// Sends the file as multipart/form-data in the "image" field
export const uploadAvatar = thunk(
  'profile/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append('image', file);
      const { data } = await api.post<ProfileResponse>('/profile/avatar', form);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
