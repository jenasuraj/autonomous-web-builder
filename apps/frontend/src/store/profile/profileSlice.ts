import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { ProfileResponse } from '../../types/profile';
import { fetchProfile, updateProfile, uploadAvatar } from './profileThunks';

interface ProfileState {
  data: ProfileResponse | null;
  loading: boolean; // fetching the page
  saving: boolean; // saving the form or uploading the picture
  error: string;
  notice: string;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  saving: false,
  error: '',
  notice: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.data = null;
        state.loading = true;
        state.error = '';
        state.notice = '';
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? 'Something went wrong';
      })
      .addMatcher(
        isAnyOf(updateProfile.pending, uploadAvatar.pending),
        (state) => {
          state.saving = true;
          state.error = '';
          state.notice = '';
        },
      )
      .addMatcher(
        isAnyOf(updateProfile.fulfilled, uploadAvatar.fulfilled),
        (state, { payload }) => {
          state.data = payload;
          state.saving = false;
          state.notice = 'Saved';
        },
      )
      .addMatcher(
        isAnyOf(updateProfile.rejected, uploadAvatar.rejected),
        (state, { payload }) => {
          state.saving = false;
          state.error = payload ?? 'Something went wrong';
        },
      );
  },
});

export default profileSlice.reducer;
