import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flag, MapPin, Clock, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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

interface Circuit {
  name: string;
  locality: string;
  country: string;
}

interface Winner {
  driver: Driver;
  constructor: Constructor;
}

interface RaceCardProps {
  season: number;
  round: number;
  raceName: string;
  date: string;
  time: string;
  circuit: Circuit;
  winner: Winner;
  index: number;
  isChampion?: boolean;
  viewMode?: 'grid' | 'list';
  isClickable?: boolean;
}

export function RaceCard({ 
  season, 
  round, 
  raceName, 
  date, 
  time, 
  circuit, 
  winner, 
  index,
  isChampion = false,
  viewMode = 'list',
  isClickable = false
}: RaceCardProps) {
  const isGridView = viewMode === 'grid';
  const raceDetailUrl = `/races/${season}/${round}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isGridView ? 0 : -50, y: isGridView ? 20 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 ${
        isChampion 
          ? 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-400/20' 
          : 'border-gray-200 dark:border-gray-700'
      } ${isGridView ? 'h-full' : ''} ${
        isClickable 
          ? 'hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1' 
          : 'hover:shadow-xl'
      }`}
    >
      <div className="p-6">
        {isChampion && (
          <div className="mb-4 px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full inline-block border border-yellow-300 dark:border-yellow-600">
            🏆 Championship Winning Race
          </div>
        )}
        
        <div className={`flex ${isGridView ? 'flex-col space-y-4' : 'flex-col lg:flex-row lg:items-center lg:justify-between'}`}>
          {/* Race Info */}
          <div className={`${isGridView ? '' : 'flex-1 mb-4 lg:mb-0'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Flag className="h-4 w-4 text-red-600" />
                  {isClickable ? (
                    <Link 
                      href={raceDetailUrl}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      Round {round}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Round {round}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-500">•</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {season}
                  </span>
                </div>
              </div>
              
              {isClickable && (
                <Link 
                  href={raceDetailUrl}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-200 text-xs font-medium border border-blue-200 dark:border-blue-700"
                >
                  <span>View Details</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${isGridView ? 'text-lg' : 'text-xl'}`}>
                {isClickable ? (
                  <Link 
                    href={raceDetailUrl}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {raceName}
                  </Link>
                ) : (
                  raceName
                )}
              </h3>
            </div>

            <div className={`flex ${isGridView ? 'flex-col space-y-2' : 'flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0'}`}>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {circuit.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {circuit.locality}, {circuit.country}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(date)} {time && `at ${time}`}
              </span>
            </div>
          </div>

          {/* Winner Info */}
          <div className={isGridView ? '' : 'lg:ml-6 lg:min-w-0 lg:flex-1 lg:max-w-sm'}>
            <div className={`rounded-lg p-4 transition-all duration-200 ${
              isChampion 
                ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700' 
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className={`h-4 w-4 ${isChampion ? 'text-yellow-600 dark:text-yellow-400' : 'text-yellow-600'}`} />
                <span className={`text-sm font-medium ${isChampion ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Race Winner
                </span>
              </div>
              
              <div className="space-y-1">
                <p className={`font-semibold ${isChampion ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-900 dark:text-gray-100'}`}>
                  {winner.driver.givenName} {winner.driver.familyName}
                </p>
                <p className={`text-sm ${isChampion ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {winner.constructor.name}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono ${isChampion ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-500'}`}>
                    {winner.driver.code}
                  </span>
                  <span className={`text-xs ${isChampion ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-500'}`}>•</span>
                  <span className={`text-xs ${isChampion ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-500'}`}>
                    {winner.driver.nationality}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 