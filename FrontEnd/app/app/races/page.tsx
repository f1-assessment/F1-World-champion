"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flag, Filter, Calendar, Grid, Trophy, MapPin, Clock, Users, Target, Zap, BarChart3, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RaceCard } from "@/components/race-card";
import { SeasonSelector } from "@/components/season-selector";
import { getSeasonYears } from "@/lib/utils";
import { apiClient } from "@/lib/api";

interface Race {
  id: string;
  season: number;
  round: number;
  raceName: string;
  date: string;
  time: string;
  circuitId: string;
  circuitName: string;
  circuitUrl: string;
  locality: string;
  country: string;
  winner: {
    id: string;
    code: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  constructor: {
    id: string;
    name: string;
    nationality: string;
  };
  grid: number;
  laps: number;
  status: string;
}

interface RaceStats {
  totalRaces: number;
  totalSeasons: number;
  completedRaces: number;
  uniqueWinners: number;
  uniqueCircuits: number;
  uniqueConstructors: number;
  mostWinsDriver: { name: string; wins: number };
  mostWinsConstructor: { name: string; wins: number };
  averageRacesPerSeason: number;
}

export default function RacesPage() {
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAllYears, setShowAllYears] = useState(true);
  const [stats, setStats] = useState<RaceStats | null>(null);
  const [sortBy, setSortBy] = useState<'season' | 'date' | 'name'>('season');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const years = getSeasonYears();

  // Separate useEffect for mounting to prevent setState during render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchRaces() {
      try {
        setError(null);
        const data = await apiClient.getAllRaces();
        
        // Validate and filter the data to ensure all required properties exist
        const validRaces = Array.isArray(data) ? data.filter(race => 
          race && 
          race.id && 
          race.season && 
          race.round && 
          race.raceName
        ) : [];
        
        setAllRaces(validRaces);
        
        // Calculate comprehensive stats
        calculateStats(validRaces);
      } catch (error) {
        console.error("Error fetching races:", error);
        setError(error instanceof Error ? error.message : "Failed to load races");
        setAllRaces([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch when mounted and not already loading/loaded
    if (mounted && loading) {
      fetchRaces();
    }
  }, [mounted, loading]);

  // Calculate comprehensive statistics
  const calculateStats = (races: Race[]) => {
    if (races.length === 0) {
      setStats(null);
      return;
    }

    const seasons = new Set(races.map(race => race.season));
    const completedRaces = races.filter(race => race.winner && race.winner.id);
    const uniqueWinners = new Set(completedRaces.map(race => race.winner.id));
    const uniqueCircuits = new Set(races.map(race => race.circuitId).filter(Boolean));
    const uniqueConstructors = new Set(completedRaces.map(race => race.constructor.id).filter(Boolean));

    // Driver wins count
    const driverWins: Record<string, number> = {};
    completedRaces.forEach(race => {
      const driverName = `${race.winner.givenName} ${race.winner.familyName}`.trim();
      driverWins[driverName] = (driverWins[driverName] || 0) + 1;
    });

    // Constructor wins count
    const constructorWins: Record<string, number> = {};
    completedRaces.forEach(race => {
      const constructorName = race.constructor.name;
      if (constructorName) {
        constructorWins[constructorName] = (constructorWins[constructorName] || 0) + 1;
      }
    });

    const mostWinsDriver = Object.entries(driverWins).reduce((max, [name, wins]) => 
      wins > max.wins ? { name, wins } : max, { name: 'N/A', wins: 0 });

    const mostWinsConstructor = Object.entries(constructorWins).reduce((max, [name, wins]) => 
      wins > max.wins ? { name, wins } : max, { name: 'N/A', wins: 0 });

    setStats({
      totalRaces: races.length,
      totalSeasons: seasons.size,
      completedRaces: completedRaces.length,
      uniqueWinners: uniqueWinners.size,
      uniqueCircuits: uniqueCircuits.size,
      uniqueConstructors: uniqueConstructors.size,
      mostWinsDriver,
      mostWinsConstructor,
      averageRacesPerSeason: Math.round((races.length / seasons.size) * 100) / 100
    });
  };

  // Filter and sort races
  useEffect(() => {
    let result = [...allRaces];
    
    // Apply year filter if not showing all years
    if (!showAllYears && selectedYear) {
      result = result.filter(race => race.season === selectedYear);
    }
    
    // Apply text filter
    if (filter) {
      result = result.filter(
        (race) =>
          race &&
          (race.raceName?.toLowerCase().includes(filter.toLowerCase()) ||
          race.circuitName?.toLowerCase().includes(filter.toLowerCase()) ||
          race.locality?.toLowerCase().includes(filter.toLowerCase()) ||
          race.country?.toLowerCase().includes(filter.toLowerCase()) ||
          race.winner?.givenName?.toLowerCase().includes(filter.toLowerCase()) ||
          race.winner?.familyName?.toLowerCase().includes(filter.toLowerCase()) ||
          race.constructor?.name?.toLowerCase().includes(filter.toLowerCase()) ||
          race.season?.toString().includes(filter))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'season':
          comparison = a.season - b.season || a.round - b.round;
          break;
        case 'date':
          comparison = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
          break;
        case 'name':
          comparison = (a.raceName || '').localeCompare(b.raceName || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredRaces(result);
  }, [allRaces, selectedYear, filter, showAllYears, sortBy, sortOrder]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setShowAllYears(false);
  };

  const handleShowAllYears = () => {
    setShowAllYears(true);
    setSelectedYear(null);
  };

  const StatCard = ({ icon: Icon, label, value, color = "text-gray-600", onClick }: {
    icon: any;
    label: string;
    value: number | string;
    color?: string;
    onClick?: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-red-50 dark:bg-red-900/20`}>
          <Icon className={`h-6 w-6 text-red-600 dark:text-red-400`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${color} dark:text-gray-100`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Formula 1 Races"
        subtitle={`Comprehensive race database${showAllYears ? ' - All seasons' : ` - ${selectedYear} season`} with detailed statistics and race information`}
        accentWord="Races"
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Unable to load races</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Comprehensive Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Race Statistics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Flag} label="Total Races" value={stats.totalRaces} />
                <StatCard icon={Calendar} label="Seasons" value={stats.totalSeasons} />
                <StatCard icon={Trophy} label="Completed" value={stats.completedRaces} />
                <StatCard icon={Target} label="Avg/Season" value={stats.averageRacesPerSeason} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Unique Winners" value={stats.uniqueWinners} />
                <StatCard icon={MapPin} label="Circuits" value={stats.uniqueCircuits} />
                <StatCard icon={Zap} label="Constructors" value={stats.uniqueConstructors} />
                <StatCard 
                  icon={TrendingUp} 
                  label="Most Wins Driver" 
                  value={`${stats.mostWinsDriver.name} (${stats.mostWinsDriver.wins})`} 
                />
              </div>
            </motion.div>
          )}

          {/* Enhanced Filter Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Filter */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search races..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                
                {/* Year Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">Filter:</span>
                  </div>
                  <button
                    onClick={handleShowAllYears}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      showAllYears
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Years
                  </button>
                  <select
                    value={selectedYear || ''}
                    onChange={(e) => e.target.value ? handleYearChange(parseInt(e.target.value)) : handleShowAllYears()}
                    className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'season' | 'date' | 'name')}
                    className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-gray-100"
                  >
                    <option value="season">Season</option>
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <BarChart3 className={`h-4 w-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{filteredRaces.length}</span> race{filteredRaces.length !== 1 ? 's' : ''} 
                {!showAllYears && selectedYear && ` from ${selectedYear}`}
                {filter && ` matching "${filter}"`}
              </p>
            </div>
          </motion.div>

          {/* Race Results */}
          {filteredRaces.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No races found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter ? "Try adjusting your search criteria" : "No race data available"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }
            >
              {filteredRaces
                .filter(race => race && race.id && race.raceName)
                .map((race, index) => (
                <RaceCard
                  key={`${race.season}-${race.round}-${race.id}`}
                  season={race.season}
                  round={race.round}
                  raceName={race.raceName}
                  date={race.date}
                  time={race.time}
                  circuit={{
                    name: race.circuitName,
                    locality: race.locality,
                    country: race.country
                  }}
                  winner={{
                    driver: race.winner,
                    constructor: race.constructor
                  }}
                  index={index}
                  viewMode={viewMode}
                  isClickable={true}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
} 