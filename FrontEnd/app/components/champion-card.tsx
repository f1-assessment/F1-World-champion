import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Calendar } from 'lucide-react';

interface Driver {
  id: string;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

interface Constructor {
  id: string;
  name: string;
  nationality: string;
}

interface ChampionCardProps {
  id: string;
  season: number;
  driver: Driver;
  constructorTeam: Constructor;
  points: number;
  wins: number;
  index: number;
}

export function ChampionCard({ 
  id, 
  season, 
  driver, 
  constructorTeam, 
  points, 
  wins, 
  index 
}: ChampionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Season and Trophy */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {season}
            </span>
          </div>
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>

        {/* Driver Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {driver.givenName} {driver.familyName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {driver.nationality}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
            {driver.code}
          </p>
        </div>

        {/* Constructor */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {constructorTeam.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {constructorTeam.nationality}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Points
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {points}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Medal className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Wins
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {wins}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 