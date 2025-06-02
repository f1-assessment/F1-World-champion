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
      console.log("Raw lap data response:", response);
      // Handle both "Timings" and "timings" from the API response
      const processedLaps = (response.laps || []).map((lap: any) => ({
        ...lap,
        timings: lap.timings || lap.Timings || []
      }));
      console.log("Processed lap data:", processedLaps);
      setLapData(processedLaps);
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
        ) : lapData.every(lap => !lap.timings || lap.timings.length === 0) ? (
          <div className="text-center py-12">
            {/* Animated Racing Track */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              {/* Track */}
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              >
                {/* Track Background */}
                <ellipse
                  cx="160"
                  cy="160"
                  rx="140"
                  ry="140"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="24"
                  className="dark:stroke-gray-600"
                />
                
                {/* Track Surface */}
                <ellipse
                  cx="160"
                  cy="160"
                  rx="140"
                  ry="140"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="16"
                  className="dark:stroke-gray-500"
                />
                
                {/* Start/Finish Line */}
                <line
                  x1="160"
                  y1="20"
                  x2="160"
                  y2="44"
                  stroke="#ef4444"
                  strokeWidth="4"
                  className="animate-pulse"
                />
                
                {/* Track Center Line */}
                <ellipse
                  cx="160"
                  cy="160"
                  rx="140"
                  ry="140"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="8,8"
                  className="dark:stroke-gray-300 opacity-50"
                />
                
                {/* Animated Car */}
                <g className="animate-spin" style={{
                  transformOrigin: '160px 160px',
                  animation: 'spin 3s linear infinite'
                }}>
                  <g transform="translate(160, 20)">
                    {/* Car Body */}
                    <rect
                      x="-6"
                      y="-4"
                      width="12"
                      height="8"
                      rx="2"
                      fill="#8b5cf6"
                      className="drop-shadow-sm"
                    />
                    {/* Car Front Wing */}
                    <rect
                      x="-4"
                      y="-6"
                      width="8"
                      height="2"
                      rx="1"
                      fill="#6d28d9"
                    />
                    {/* Car Rear Wing */}
                    <rect
                      x="-3"
                      y="4"
                      width="6"
                      height="2"
                      rx="1"
                      fill="#6d28d9"
                    />
                    {/* Speed Trail */}
                    <circle
                      cx="-10"
                      cy="0"
                      r="1"
                      fill="#8b5cf6"
                      opacity="0.6"
                    />
                    <circle
                      cx="-14"
                      cy="0"
                      r="0.8"
                      fill="#8b5cf6"
                      opacity="0.4"
                    />
                    <circle
                      cx="-18"
                      cy="0"
                      r="0.6"
                      fill="#8b5cf6"
                      opacity="0.2"
                    />
                  </g>
                </g>
                
                {/* Lap Counter Animation */}
                <text
                  x="160"
                  y="160"
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-2xl font-bold fill-purple-600 dark:fill-purple-400"
                  style={{
                    fontFamily: 'system-ui, sans-serif'
                  }}
                >
                  LAP {lapData.length}
                </text>
              </svg>
            </div>
            
            {/* Status Information */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Race Data Loading
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Found {lapData.length} laps, waiting for timing data...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                This may be because the race is in progress or timing data isn't available yet for this season/round.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleUpdateData}
                  disabled={updating}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
                  <span>{updating ? 'Updating...' : 'Refresh Data'}</span>
                </button>
                
                <button
                  onClick={() => {
                    // Navigate to a different race or season
                    window.history.back();
                  }}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <Clock className="h-4 w-4" />
                  <span>Try Different Race</span>
                </button>
              </div>
            </div>
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