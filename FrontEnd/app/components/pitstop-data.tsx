"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, RefreshCw, Filter, Clock, BarChart3, Trophy, Target } from "lucide-react";
import { apiClient } from "@/lib/api";

interface PitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

interface PitStopDataProps {
  season: number;
  round: number;
}

export function PitStopDataComponent({ season, round }: PitStopDataProps) {
  const [pitStopData, setPitStopData] = useState<PitStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'duration' | 'lap' | 'driver'>('duration');
  const [viewMode, setViewMode] = useState<'table' | 'stats'>('table');

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
    fetchPitStopData();
  }, [season, round]);

  const fetchPitStopData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiClient.getPitStopData(season, round);
      setPitStopData(response.pitStops || []);
    } catch (error) {
      console.error("Error fetching pitstop data:", error);
      setError(error instanceof Error ? error.message : "Failed to load pitstop data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = async () => {
    try {
      setUpdating(true);
      await apiClient.updatePitStopData(season, round);
      await fetchPitStopData();
    } catch (error) {
      console.error("Error updating pitstop data:", error);
      setError(error instanceof Error ? error.message : "Failed to update pitstop data");
    } finally {
      setUpdating(false);
    }
  };

  const getFilteredAndSortedData = () => {
    let filtered = pitStopData;
    
    if (selectedDriver !== 'all') {
      filtered = pitStopData.filter(ps => ps.driverId === selectedDriver);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return parseFloat(a.duration) - parseFloat(b.duration);
        case 'lap':
          return parseInt(a.lap) - parseInt(b.lap);
        case 'driver':
          return getDriverName(a.driverId).localeCompare(getDriverName(b.driverId));
        default:
          return 0;
      }
    });
  };

  const getUniqueDrivers = () => {
    const drivers = Array.from(new Set(pitStopData.map(ps => ps.driverId)));
    return drivers.sort((a, b) => getDriverName(a).localeCompare(getDriverName(b)));
  };

  const getPitStopStats = () => {
    if (pitStopData.length === 0) return null;

    const durations = pitStopData.map(ps => parseFloat(ps.duration)).filter(d => !isNaN(d));
    const fastest = Math.min(...durations);
    const slowest = Math.max(...durations);
    const average = durations.reduce((a, b) => a + b, 0) / durations.length;

    const fastestStop = pitStopData.find(ps => parseFloat(ps.duration) === fastest);
    const slowestStop = pitStopData.find(ps => parseFloat(ps.duration) === slowest);

    const driverStops = getUniqueDrivers().map(driverId => {
      const stops = pitStopData.filter(ps => ps.driverId === driverId);
      const avgDuration = stops.reduce((sum, ps) => sum + parseFloat(ps.duration), 0) / stops.length;
      return {
        driverId,
        count: stops.length,
        avgDuration: avgDuration.toFixed(3)
      };
    });

    return {
      fastest,
      slowest,
      average,
      fastestStop,
      slowestStop,
      driverStops
    };
  };

  const getDurationColor = (duration: string) => {
    const time = parseFloat(duration);
    if (time < 13) return 'text-green-600 dark:text-green-400';
    if (time < 15) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
        <div className="px-6 py-4 border-b border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-900/30">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-200 dark:bg-green-800">
              <Zap className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Pit Stops</h3>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-green-600 dark:text-green-400">Loading pitstop data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
        <div className="px-6 py-4 border-b border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-200 dark:bg-green-800">
                <Zap className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Pit Stops</h3>
            </div>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <p className="text-gray-500 dark:text-gray-400">
            Try updating the data or check if the race has pitstop information available.
          </p>
        </div>
      </div>
    );
  }

  const stats = getPitStopStats();
  const filteredData = getFilteredAndSortedData();

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-green-200 dark:border-green-700 bg-green-100 dark:bg-green-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-200 dark:bg-green-800">
              <Zap className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pit Stops</h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {pitStopData.length} pit stops recorded
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'table' | 'stats')}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="table">Table View</option>
              <option value="stats">Statistics</option>
            </select>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {pitStopData.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No pitstop data available for this race
            </p>
            <button
              onClick={handleUpdateData}
              disabled={updating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
              <span>Fetch Data</span>
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-green-600 dark:text-green-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver:</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded text-sm"
                >
                  <option value="all">All Drivers</option>
                  {getUniqueDrivers().map(driverId => (
                    <option key={driverId} value={driverId}>
                      {getDriverName(driverId)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'duration' | 'lap' | 'driver')}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded text-sm"
                >
                  <option value="duration">Duration</option>
                  <option value="lap">Lap Number</option>
                  <option value="driver">Driver Name</option>
                </select>
              </div>
            </div>

            {/* Pitstop Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-100 dark:bg-green-900/40">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Lap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Stop #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-200 dark:divide-green-700">
                    {filteredData.map((pitStop, index) => (
                      <motion.tr
                        key={`${pitStop.driverId}-${pitStop.stop}-${pitStop.lap}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getDriverColor(pitStop.driverId)}`}></div>
                            <span className="text-gray-900 dark:text-gray-100 font-semibold">
                              {getDriverName(pitStop.driverId)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {pitStop.lap}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                          {pitStop.stop}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-green-600 dark:text-green-400 font-semibold">
                          {pitStop.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-mono font-bold ${getDurationColor(pitStop.duration)}`}>
                            {pitStop.duration}s
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Statistics View */
          <div className="space-y-6">
            {stats && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-600 dark:text-green-400">Fastest Stop</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.fastest.toFixed(3)}s
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.fastestStop && getDriverName(stats.fastestStop.driverId)} (Lap {stats.fastestStop?.lap})
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400">Average</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.average.toFixed(3)}s
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Across all stops
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h4 className="font-semibold text-red-600 dark:text-red-400">Slowest Stop</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.slowest.toFixed(3)}s
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.slowestStop && getDriverName(stats.slowestStop.driverId)} (Lap {stats.slowestStop?.lap})
                    </p>
                  </div>
                </div>

                {/* Driver Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 overflow-hidden">
                  <div className="px-4 py-3 bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Driver Performance</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {stats.driverStops.map((driver) => (
                      <div key={driver.driverId} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${getDriverColor(driver.driverId)}`}></div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {getDriverName(driver.driverId)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-green-600 dark:text-green-400">
                            {driver.avgDuration}s avg
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {driver.count} stop{driver.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 