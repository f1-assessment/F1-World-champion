"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Flag, Trophy, Clock, MapPin, Calendar, Users, 
  Zap, Target, Activity, Timer, BarChart3, ChevronDown,
  ExternalLink, Award, Gauge, CircuitBoard
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LapDataComponent } from "@/components/lap-data";
import { PitStopDataComponent } from "@/components/pitstop-data";
import { formatDate } from "@/lib/utils";
import { apiClient } from "@/lib/api";

interface RaceDetails {
  id: string;
  season: number;
  round: number;
  raceName: string;
  date: string;
  time: string;
  url: string;
  circuit: {
    circuitId: string;
    circuitName: string;
    url: string;
    location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  results: Array<{
    position: string;
    positionText: string;
    points: string;
    driverId: string;
    constructorId: string;
    grid: string;
    laps: string;
    status: string;
    time?: {
      millis: string;
      time: string;
    };
    fastestLap?: {
      rank: string;
      lap: string;
      time: string;
      averageSpeed: {
        units: string;
        speed: string;
      };
    };
  }>;
  laps: Array<{
    number: string;
    timings: Array<{
      driverId: string;
      position: string;
      time: string;
    }>;
  }>;
  pitStops: Array<{
    driverId: string;
    lap: string;
    stop: string;
    time: string;
    duration: string;
  }>;
  qualifying?: {
    date: string;
    time: string;
  };
  firstPractice?: {
    date: string;
    time: string;
  };
  secondPractice?: {
    date: string;
    time: string;
  };
  thirdPractice?: {
    date: string;
    time: string;
  };
  sprint?: {
    date: string;
    time: string;
  };
}

export default function RaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [race, setRace] = useState<RaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'laps' | 'pitstops'>('overview');
  const [mounted, setMounted] = useState(false);

  const season = params?.season as string;
  const round = params?.round as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchRaceDetails() {
      if (!season || !round) return;
      
      try {
        setError(null);
        const data = await apiClient.getRaceBySeasonAndRound(parseInt(season), parseInt(round));
        setRace(data);
      } catch (error) {
        console.error("Error fetching race details:", error);
        setError(error instanceof Error ? error.message : "Failed to load race details");
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchRaceDetails();
    }
  }, [season, round, mounted]);

  const getDriverName = (driverId: string) => {
    // Helper function to convert driver ID to readable name
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
      'bottas': 'Valtteri Bottas'
    };
    return driverNames[driverId] || driverId.replace('_', ' ');
  };

  const getConstructorName = (constructorId: string) => {
    const constructorNames: Record<string, string> = {
      'red_bull': 'Red Bull Racing',
      'mercedes': 'Mercedes',
      'ferrari': 'Ferrari',
      'mclaren': 'McLaren',
      'alpine': 'Alpine',
      'aston_martin': 'Aston Martin',
      'williams': 'Williams',
      'alphatauri': 'AlphaTauri',
      'alfa': 'Alfa Romeo',
      'haas': 'Haas'
    };
    return constructorNames[constructorId] || constructorId;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !race) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <Flag className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Race not found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || `Could not find race data for ${season} season, round ${round}`}
          </p>
          <button
            onClick={() => router.push('/races')}
            className="btn btn-primary"
          >
            Back to Races
          </button>
        </div>
      </div>
    );
  }

  const winner = race.results?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Races</span>
        </button>
        
        <PageHeader 
          title={race.raceName}
          subtitle={`${race.season} Formula 1 Season • Round ${race.round} • ${race.circuit.location.locality}, ${race.circuit.location.country}`}
          accentWord={race.raceName.split(' ')[0]}
        />
      </div>

      {/* Race Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Race Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatDate(race.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <CircuitBoard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Circuit</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {race.circuit.circuitName}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Winner</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {winner ? getDriverName(winner.driverId) : 'TBD'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Finishers</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {race.results?.filter(r => r.status === 'Finished').length || 0}/{race.results?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <nav className="-mb-px flex space-x-8 px-6 pt-4">
            {[
              { id: 'overview', name: 'Overview', icon: Flag, color: 'blue' },
              { id: 'results', name: 'Results', icon: Trophy, color: 'yellow' },
              { id: 'laps', name: 'Lap Times', icon: Timer, color: 'purple' },
              { id: 'pitstops', name: 'Pit Stops', icon: Zap, color: 'green' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-3 font-medium text-sm transition-all duration-200 rounded-t-lg ${
                    isActive
                      ? tab.color === 'blue' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : tab.color === 'yellow'
                        ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        : tab.color === 'purple'
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Circuit Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 shadow-sm border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
                  <CircuitBoard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Circuit Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Circuit Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{race.circuit.circuitName}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Location</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {race.circuit.location.locality}, {race.circuit.location.country}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Coordinates</p>
                  <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                    {race.circuit.location.lat}, {race.circuit.location.long}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">More Info</p>
                  <a 
                    href={race.circuit.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Wikipedia</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Session Schedule */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 shadow-sm border border-purple-200 dark:border-purple-700">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Session Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'First Practice', session: race.firstPractice },
                  { name: 'Second Practice', session: race.secondPractice },
                  { name: 'Third Practice', session: race.thirdPractice },
                  { name: 'Qualifying', session: race.qualifying },
                  { name: 'Sprint', session: race.sprint },
                  { name: 'Race', session: { date: race.date, time: race.time } }
                ].filter(item => item.session).map((item) => (
                  <div key={item.name} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-purple-600 dark:text-purple-400 mb-1">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(item.session!.date)} {item.session!.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-200 dark:border-yellow-700 bg-yellow-100 dark:bg-yellow-900/30">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-200 dark:bg-yellow-800">
                  <Trophy className="h-6 w-6 text-yellow-700 dark:text-yellow-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-3">Race Results</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-100 dark:bg-yellow-900/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Constructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Grid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Laps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-200 dark:divide-yellow-700">
                  {race.results?.map((result, index) => (
                    <tr key={result.driverId} className={`transition-colors ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-800/50 dark:to-amber-800/50 shadow-lg' 
                        : index < 3 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'bg-white dark:bg-gray-800'
                    } hover:bg-yellow-100 dark:hover:bg-yellow-900/30`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <div className="mr-3 p-1 rounded-full bg-yellow-400 dark:bg-yellow-500">
                              <Trophy className="h-5 w-5 text-yellow-800 dark:text-yellow-900" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="mr-3 p-1 rounded-full bg-gray-300 dark:bg-gray-600">
                              <Trophy className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="mr-3 p-1 rounded-full bg-amber-600 dark:bg-amber-700">
                              <Trophy className="h-4 w-4 text-amber-100" />
                            </div>
                          )}
                          <span className={`font-bold text-lg ${
                            index === 0 
                              ? 'text-yellow-800 dark:text-yellow-200' 
                              : index < 3 
                              ? 'text-yellow-700 dark:text-yellow-300' 
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {result.position}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        index === 0 
                          ? 'text-yellow-800 dark:text-yellow-200' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {getDriverName(result.driverId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {getConstructorName(result.constructorId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {result.grid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {result.laps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {result.time?.time || result.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold px-2 py-1 rounded ${
                          parseInt(result.points) > 0 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'text-gray-400'
                        }`}>
                          {result.points}
                        </span>
                      </td>
                    </tr>
                  )) || []}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'laps' && (
          <LapDataComponent season={parseInt(season)} round={parseInt(round)} />
        )}

        {activeTab === 'pitstops' && (
          <PitStopDataComponent season={parseInt(season)} round={parseInt(round)} />
        )}
      </motion.div>
    </div>
  );
} 