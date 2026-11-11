import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/api';
import type {
  InvokeResponse,
  ThreadDetail,
  ThreadSummary,
} from '../../types/dashboard';
import { getErrorMessage } from '../../utils/helpers';
import type { RootState } from '../index';

const thunk = createAsyncThunk.withTypes<{
  state: RootState;
  rejectValue: string;
}>();

// Sidebar list of the user's chats
export const fetchThreads = thunk(
  'dashboard/fetchThreads',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ThreadSummary[]>('/graph/threads');
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// A fresh chat; the backend reuses the user's unused one if there is one
export const createThread = thunk(
  'dashboard/createThread',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await api.post<{ threadId: string }>('/graph/threads');
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// Loads an old chat's messages when it is clicked in the sidebar
export const openThread = thunk(
  'dashboard/openThread',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ThreadDetail>(
        `/graph/threads/${threadId}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

// Sends the message to the agent on the current thread
export const sendMessage = thunk(
  'dashboard/sendMessage',
  async (message: string, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post<InvokeResponse>('/graph/invoke', {
        message,
        threadId: getState().dashboard.threadId,
      });
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
