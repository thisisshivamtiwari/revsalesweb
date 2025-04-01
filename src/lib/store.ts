import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';
import { meetingsApi } from './features/meetings/meetingsApi';
import { leadsApi } from './features/leads/leadsApi';
import { tasksApi } from './features/tasks/tasksApi';
import { dashboardApi } from './features/dashboard/dashboardApi';
import { teamsApi } from './features/teams/teamsApi';
import { userApi } from './features/user/userApi';
import { whatsappApi } from './features/whatsapp/whatsappApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [meetingsApi.reducerPath]: meetingsApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [whatsappApi.reducerPath]: whatsappApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      meetingsApi.middleware,
      leadsApi.middleware,
      tasksApi.middleware,
      dashboardApi.middleware,
      teamsApi.middleware,
      userApi.middleware,
      whatsappApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 