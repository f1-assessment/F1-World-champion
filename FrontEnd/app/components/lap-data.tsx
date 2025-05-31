"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, ChevronDown, RefreshCw, Clock, BarChart3, Trophy } from "lucide-react";
import { apiClient } from "@/lib/api";

interface LapTiming {
  driverId: string;
  position: string;
  time: string;
}

interface LapData {
  number: string;
  timings: LapTiming[];
}

interface LapDataProps {
  season: number;
  round: number;
}

export function LapDataComponent({ season, round }: LapDataProps) {
  const [lapData, setLapData] = useState<LapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLap, setSelectedLap] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const getDriverName = (driverId: string) => {
    const driverNames: Record<string, string> = {
      'max_verstappen': 'Max Verstappen',
      'hamilton': 'Lewis Hamilton',
      'alonso': 'Fernando Alonso',
      'piastri': 'Oscar Piastri',
      'leclerc': 'Charles Leclerc',
      'sainz': 'Carlos Sainz',
      'norris': 'Lando Norris',
      'russell': 'George Russell',
      'perez': 'Sergio Pérez',
      'bottas': 'Valtteri Bottas',
      'tsunoda': 'Yuki Tsunoda',
      'albon': 'Alexander Albon',
      'gasly': 'Pierre Gasly',
      'stroll': 'Lance Stroll',
      'hulkenberg': 'Nico Hülkenberg',
      'antonelli': 'Andrea Kimi Antonelli',
      'bortoleto': 'Gabriel Bortoleto',
      'ocon': 'Esteban Ocon',
      'lawson': 'Liam Lawson',
      'bearman': 'Oliver Bearman'
    };
    return driverNames[driverId] || driverId.replace('_', ' ');
  };

  const getDriverColor = (driverId: string) => {
    const colors: Record<string, string> = {
      'max_verstappen': 'bg-blue-500',
      'hamilton': 'bg-cyan-500',
      'alonso': 'bg-green-500',
      'piastri': 'bg-orange-500',
      'leclerc': 'bg-red-500',
      'sainz': 'bg-red-400',
      'norris': 'bg-orange-400',
      'russell': 'bg-cyan-400',
      'perez': 'bg-blue-400',
      'bottas': 'bg-green-400'
    };
    return colors[driverId] || 'bg-gray-500';
  };

  useEffect(() => {
    fetchLapData();
  }, [season, round]);

  const fetchLapData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiClient.getLapData(season, round);
      setLapData(response.laps || []);
    } catch (error) {
      console.error("Error fetching lap data:", error);
      setError(error instanceof Error ? error.message : "Failed to load lap data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = async () => {
    try {
      setUpdating(true);
      await apiClient.updateLapData(season, round);
      await fetchLapData();
    } catch (error) {
      console.error("Error updating lap data:", error);
      setError(error instanceof Error ? error.message : "Failed to update lap data");
    } finally {
      setUpdating(false);
    }
  };

  const getSelectedLapData = () => {
    if (!selectedLap) return null;
    return lapData.find(lap => lap.number === selectedLap);
  };

  const getFastestLapTime = (lap: LapData) => {
    if (!lap.timings || lap.timings.length === 0) return null;
    
    const validTimings = lap.timings.filter(t => t.time && t.time !== '' && !t.time.includes('+'));
    if (validTimings.length === 0) return null;
    
    return validTimings.reduce((fastest, current) => {
      if (!fastest.time || current.time < fastest.time) {
        return current;
      }
      return fastest;
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div className="px-6 py-4 border-b border-purple-200 dark:border-purple-700 bg-purple-100 dark:bg-purple-900/30">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
              <Timer className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Lap Times</h3>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-purple-600 dark:text-purple-400">Loading lap data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
        <div className="px-6 py-4 border-b border-purple-200 dark:border-purple-700 bg-purple-100 dark:bg-purple-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
                <Timer className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Lap Times</h3>
            </div>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <p className="text-gray-500 dark:text-gray-400">
            Try updating the data or check if the race has lap timing information available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-purple-200 dark:border-purple-700 bg-purple-100 dark:bg-purple-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
              <Timer className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lap Times</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {lapData.length} laps recorded
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'overview' | 'detailed')}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed View</option>
            </select>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {lapData.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No lap timing data available for this race
            </p>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Fetch Data</span>
            </button>
          </div>
        ) : viewMode === 'overview' ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {lapData.slice(0, 15).map((lap) => {
              const fastestTiming = getFastestLapTime(lap);
              return (
                <motion.div
                  key={lap.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedLap(selectedLap === lap.number ? null : lap.number)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">Lap {lap.number}</h4>
                    <div className="flex items-center space-x-2">
                      {fastestTiming && (
                        <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400">
                          <Trophy className="h-3 w-3" />
                          <span>{fastestTiming.time}</span>
                        </div>
                      )}
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${selectedLap === lap.number ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {selectedLap === lap.number && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      {lap.timings?.slice(0, 12).map((timing) => (
                        <div key={timing.driverId} className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getDriverColor(timing.driverId)}`}></div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                              {getDriverName(timing.driverId)}
                            </span>
                          </div>
                          <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold text-sm">
                            {timing.time}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lap Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Lap:
              </label>
              <select
                value={selectedLap || ''}
                onChange={(e) => setSelectedLap(e.target.value || null)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Laps Overview</option>
                {lapData.map((lap) => (
                  <option key={lap.number} value={lap.number}>
                    Lap {lap.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed View */}
            {selectedLap ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 overflow-hidden">
                <div className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-700">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400">Lap {selectedLap} - Detailed Timings</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50 dark:bg-purple-900/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase">Driver</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase">Lap Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200 dark:divide-purple-700">
                      {getSelectedLapData()?.timings?.map((timing, index) => (
                        <tr key={timing.driverId} className="hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <td className="px-4 py-3 text-purple-600 dark:text-purple-400 font-semibold">
                            {timing.position}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getDriverColor(timing.driverId)}`}></div>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {getDriverName(timing.driverId)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-purple-700 dark:text-purple-300 font-bold">
                            {timing.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Select a lap to view detailed timing information
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 