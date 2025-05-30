import React from 'react';
import { Calendar } from 'lucide-react';

interface SeasonSelectorProps {
  selectedYear: number;
  years: number[];
  onYearChange: (year: number) => void;
  className?: string;
}

export function SeasonSelector({ 
  selectedYear, 
  years, 
  onYearChange, 
  className = '' 
}: SeasonSelectorProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center">
        <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
        <span className="text-gray-600 dark:text-gray-400">Season:</span>
      </div>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
} 