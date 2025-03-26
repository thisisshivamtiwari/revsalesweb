import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';
import { meetingsApi } from './features/meetings/meetingsApi';
import { leadsApi } from './features/leads/leadsApi';
import { tasksApi } from './features/tasks/tasksApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [meetingsApi.reducerPath]: meetingsApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      meetingsApi.middleware,
      leadsApi.middleware,
      tasksApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 