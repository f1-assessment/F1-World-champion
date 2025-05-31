"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Trophy, Calendar, Flag, Car, Users, Award, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatsCard } from "@/components/ui/stats-card";
import { apiClient } from "@/lib/api";
import { Race, Champion } from "@/lib/types";
import { getCountryFlag } from "@/lib/utils";

interface SeasonPageProps {
  params: { year: string };
}

export default function SeasonPage({ params }: SeasonPageProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const year = parseInt(params.year);
  const currentYear = new Date().getFullYear();
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (isNaN(year)) return;
    fetchSeasonData();
  }, [year]);

  const fetchSeasonData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch races for the season
      const racesData = await apiClient.getRacesBySeason(year);
      setRaces(racesData);
      
      // Try to fetch champion data for the season
      try {
        const championData = await apiClient.getChampionshipBySeason(year);
        setChampion(championData);
      } catch (championError) {
        console.log(`No champion data available for ${year}`);
        // Champion data might not be available for all years, continue without it
      }
      
    } catch (error) {
      console.error(`Error fetching season data for ${year}:`, error);
      setError(error instanceof Error ? error.message : "Failed to load season data");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSeason = (newYear: number) => {
    router.push(`/seasons/${newYear}`);
  };

  if (isNaN(year)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Invalid Season</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The requested season is not valid.</p>
        <Link href="/seasons" className="btn btn-primary">
          Back to Seasons
        </Link>
      </div>
    );
  }

  const seasonStatus = year < currentYear ? 'Completed' : year > currentYear ? 'Future' : 'Current';
  const totalRaces = races.length;
  const completedRaces = races.filter(race => race.winner?.id).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/seasons" className="btn btn-outline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Seasons
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateToSeason(year - 1)}
            className="btn btn-outline"
            disabled={year <= 2005}
          >
            <ChevronLeft className="h-4 w-4" />
            {year - 1}
          </button>
          <button
            onClick={() => navigateToSeason(year + 1)}
            className="btn btn-outline"
            disabled={year >= currentYear + 1}
          >
            {year + 1}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <PageHeader 
        title={`${year} Formula 1 Season`}
        subtitle={`${seasonStatus} season with ${totalRaces} races`}
        accentWord={year.toString()}
      />

      {/* Season Status Badge */}
      <div className="mb-8 flex justify-center">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          seasonStatus === 'Current' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            : seasonStatus === 'Completed'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        }`}>
          {seasonStatus} Season
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <Flag className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Unable to load season data</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={fetchSeasonData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Season Statistics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard 
                icon={Flag} 
                value={totalRaces} 
                label="Total Races" 
              />
              <StatsCard 
                icon={Trophy} 
                value={completedRaces} 
                label="Completed Races" 
              />
              <StatsCard 
                icon={Users} 
                value={20} 
                label="Drivers" 
              />
              <StatsCard 
                icon={Car} 
                value={10} 
                label="Teams" 
              />
            </div>
          </motion.section>

          {/* Champion Section */}
          {champion && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-6">
                    <Trophy className="h-6 w-6 mr-2" />
                    {year} World Champion
                  </h2>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                      <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-2">
                          <img 
                            src={getCountryFlag(champion.driver.nationality)} 
                            alt={champion.driver.nationality} 
                            className="h-6 w-8 mr-3 rounded" 
                          />
                          <h3 className="text-2xl font-bold text-white">
                            {champion.driver.givenName} {champion.driver.familyName}
                          </h3>
                        </div>
                        <p className="text-white/80 text-lg mb-4">{champion.constructor.name}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-white">{champion.points}</div>
                            <div className="text-white/80 text-sm">Points</div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-white">{champion.wins}</div>
                            <div className="text-white/80 text-sm">Wins</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Races Section */}
          <motion.section
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="section-title mb-8">Race Calendar</h2>
            
            {races.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No races found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No race data is available for the {year} season.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {races.map((race, index) => (
                  <motion.div
                    key={race.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="card"
                  >
                    <div className="card-header">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{race.raceName}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Round {race.round} • {race.locality}, {race.country}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img 
                            src={getCountryFlag(race.country)} 
                            alt={race.country} 
                            className="h-4 w-6 rounded"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="flex items-center mb-4">
                        <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(race.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {race.winner ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-4">
                          <div className="flex items-center mb-2">
                            <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mr-2" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Winner</span>
                          </div>
                          <div className="flex items-center">
                            <img 
                              src={getCountryFlag(race.winner.nationality)} 
                              alt={race.winner.nationality} 
                              className="h-4 w-6 mr-2 rounded"
                            />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {race.winner.givenName} {race.winner.familyName}
                            </span>
                          </div>
                          {race.constructor && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {race.constructor.name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {year > currentYear ? 'Scheduled' : 'Results pending'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/races/season/${year}/round/${race.round}`}
                          className="btn btn-primary flex-1 mr-2"
                        >
                          View Race Details
                        </Link>
                        {race.circuitUrl && (
                          <a
                            href={race.circuitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Season Navigation */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="flex justify-center items-center space-x-4">
              {year > 2005 && (
                <button
                  onClick={() => navigateToSeason(year - 1)}
                  className="btn btn-outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {year - 1} Season
                </button>
              )}
              
              <Link href="/seasons" className="btn btn-primary">
                All Seasons
              </Link>
              
              {year < currentYear + 1 && (
                <button
                  onClick={() => navigateToSeason(year + 1)}
                  className="btn btn-outline"
                >
                  {year + 1} Season
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
} 