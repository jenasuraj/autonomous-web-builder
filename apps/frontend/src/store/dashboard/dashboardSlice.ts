import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { ChatMessage, ThreadSummary } from '../../types/dashboard';
import {
  createThread,
  deleteThread,
  fetchThreads,
  openThread,
  sendMessage,
} from './dashboardThunks';

interface DashboardState {
  threads: ThreadSummary[]; // sidebar
  threadId: string | null; // the open chat; null until createThread returns
  messages: ChatMessage[];
  loading: boolean;
  error: string;
}

const initialState: DashboardState = {
  threads: [],
  threadId: null,
  messages: [],
  loading: false,
  error: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, { payload }) => {
        state.threads = payload;
      })
      .addCase(createThread.fulfilled, (state, { payload }) => {
        state.threadId = payload.threadId;
        state.messages = [];
        state.error = '';
      })
      .addCase(openThread.pending, (state, { meta }) => {
        state.threadId = meta.arg;
        state.messages = [];
        state.error = '';
      })
      .addCase(openThread.fulfilled, (state, { payload }) => {
        state.messages = payload.history;
      })
      .addCase(sendMessage.pending, (state, { meta }) => {
        state.messages.push({ role: 'user', content: meta.arg });
        state.loading = true;
        state.error = '';
      })
      .addCase(sendMessage.fulfilled, (state, { payload, meta }) => {
        state.messages.push({ role: 'assistant', content: payload.reply });
        state.loading = false;
        // Move the chat to the top of the sidebar; a new chat gets its first message as title
        const existing = state.threads.find(
          (t) => t.threadId === payload.threadId,
        );
        state.threads = [
          existing ?? {
            threadId: payload.threadId,
            title: meta.arg.slice(0, 40),
          },
          ...state.threads.filter((t) => t.threadId !== payload.threadId),
        ];
      })
      .addCase(deleteThread.fulfilled, (state, { payload }) => {
        state.threads = state.threads.filter((t) => t.threadId !== payload);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      })
      .addMatcher(
        isAnyOf(
          fetchThreads.rejected,
          createThread.rejected,
          openThread.rejected,
          deleteThread.rejected,
          sendMessage.rejected,
        ),
        (state, { payload }) => {
          state.error = payload ?? 'Something went wrong';
        },
      );
  },
});

export default dashboardSlice.reducer;
