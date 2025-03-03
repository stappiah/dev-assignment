import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../Store';
import { ProjectResponse } from '../Types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://resetting-tracker.onrender.com/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Projects', 'Stats'],
  endpoints: (builder) => ({
    // User Authentication
    login: builder.mutation<{ token: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/users/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ message: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/users/register/',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Projects CRUD
    getProjects: builder.query<ProjectResponse, void>({
      query: () => '/projects/',
      providesTags: ['Projects'],
    }),
    getProjectById: builder.query<any, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Projects', id }],
    }),
    createProject: builder.mutation<any, Partial<any>>({
      query: (newProject) => ({
        url: '/projects/',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Projects', id }],
    }),

    // Search & Statistics
    searchProjects: builder.query<any[], { query: string }>({
      query: ({ query }) => `/projects2/search?query=${query}`,
      providesTags: ['Projects'],
    }),
    getStatistics: builder.query<any, void>({
      query: () => '/projects2/status-stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useSearchProjectsQuery,
  useGetStatisticsQuery,
} = apiSlice;