// F1 Types
export interface Season {
  season: string;
  url: string;
}

export interface Race {
  id: string;
  season: string;
  round: string;
  raceName: string;
  locality: string;  // Top-level for easy access
  country: string;   // Top-level for easy access
  circuit: {
    circuitId: string;
    circuitName: string;
    location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
    url: string;
  };
  date: string;
  time?: string;
  winner?: {
    id: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  results?: any[];
  laps?: any[];
  pitStops?: any[];
  constructor?: {
    id: string;
    name: string;
    nationality: string;
  };
  circuitUrl?: string;
}

export interface Champion {
  driver: {
    id: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  constructor: {
    id: string;
    name: string;
    nationality: string;
  };
  points: string;
  wins: string;
  season: string;
}

// Expense Types (existing)
export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}