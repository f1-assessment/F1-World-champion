// This file provides a compatibility layer for code that was previously using Prisma
// It now redirects to the API client that connects to our custom backend

import { API_BASE_URL, fetchFromAPI } from './db';

// Mock Prisma client that redirects to the custom backend API
export const prisma = {
  driver: {
    findMany: async () => fetchFromAPI('/drivers'),
    findUnique: async ({ where }: any) => fetchFromAPI(`/drivers/${where.id}`),
  },
  constructor: {
    findMany: async () => fetchFromAPI('/constructors'),
    findUnique: async ({ where }: any) => fetchFromAPI(`/constructors/${where.id}`),
  },
  driver_Championship: {
    findMany: async ({ orderBy }: any) => fetchFromAPI('/championships'),
    findUnique: async ({ where }: any) => fetchFromAPI(`/championships/${where.season}`),
  },
  race: {
    findMany: async ({ where }: any) => {
      if (where.season) {
        return fetchFromAPI(`/races/season/${where.season}`);
      }
      return fetchFromAPI('/races');
    },
    findUnique: async ({ where }: any) => {
      if (where.season && where.round) {
        return fetchFromAPI(`/races/season/${where.season}/round/${where.round}`);
      }
      return null;
    },
  },
};