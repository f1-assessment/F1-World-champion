import React from 'react';
import { Trophy } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-red-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              F1 Champions
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} F1 Champions Dashboard. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Powered by Ergast API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 