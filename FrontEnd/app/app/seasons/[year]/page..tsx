"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Calendar, Flag, Car } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RaceCard } from "@/components/race-card";
import { SeasonSelector } from "@/components/season-selector";
import { StatsCard } from "@/components/ui/stats-card";
import { getCountryFlag, getSeasonYears } from "@/lib/utils";

interface SeasonData {
  champion: {
    id: string;
    season: number;
    points: number;
    wins: number;
    driver: {
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
  };
  races: {
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
  }[];
}

export default function SeasonPage({ params }: { params: { year: string } }) {
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const year = parseInt(params.year);
  const availableYears = getSeasonYears();

  const handleYearChange = (newYear: number) => {
    router.push(`/seasons/${newYear}`);
  };

  useEffect(() => {
    async function fetchSeasonData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/seasons/${year}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${year}`);
        }
        const data = await response.json();
        setSeasonData(data);
      } catch (error) {
        console.error(`Error fetching data for ${year}:`, error);
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(year)) {
      fetchSeasonData();
    }
  }, [year]);

  if (isNaN(year)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid Season</h1>
        <p>The requested season is not valid.</p>
      </div>
    );
  }

  const championImageUrl = seasonData?.champion 
    ? `https://ichef.bbci.co.uk/news/640/cpsprodpb/14EA6/production/_109507658_f1_hamilton_championship_history-nc.png ${seasonData.champion.driver.familyName} ${year} portrait}`
    : "";

  const constructorImageUrl = seasonData?.champion 
    ? `https://www.theweek.in/content/dam/week/week/web-stories/sports/images/2024/12/9/Untitled%20design%20(6).jpg Formula 1 team ${year} car}`
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <PageHeader 
          title={`${year} Formula 1 Season`}
          subtitle="Race results and championship details"
        />
        <div className="hidden sm:block">
          <SeasonSelector 
            selectedYear={year}
            years={availableYears}
            onYearChange={handleYearChange}
          />
        </div>
      </div>
      
      <div className="sm:hidden mb-6">
        <SeasonSelector 
          selectedYear={year}
          years={availableYears}
          onYearChange={handleYearChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !seasonData ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Season data not available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find data for the {year} season
          </p>
        </div>
      ) : (
        <>
          {/* Champion Section */}
          {seasonData.champion && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Trophy className="h-6 w-6 mr-2" />
                  {year} World Champion
                </h2>
              </div>
              
              <div className="p-6 md:flex">
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${championImageUrl})` }}
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="flex items-center mb-4">
                    <img 
                      src={getCountryFlag(seasonData.champion.driver.nationality)} 
                      alt={seasonData.champion.driver.nationality} 
                      className="h-5 mr-2" 
                    />
                    <h3 className="text-3xl font-bold">
                      {seasonData.champion.driver.givenName} {seasonData.champion.driver.familyName}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Team</div>
                      <div className="font-bold text-lg flex items-center">
                        <Car className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                        {seasonData.champion.constructor.name}
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                      <div className="font-bold text-lg">{seasonData.champion.points}</div>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Race Wins</div>
                      <div className="font-bold text-lg">{seasonData.champion.wins}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Championship Car</div>
                    <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${constructorImageUrl})` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      {seasonData.champion.driver.givenName} {seasonData.champion.driver.familyName} won the {year} Formula 1 World Championship 
                      driving for {seasonData.champion.constructor.name}, securing {seasonData.champion.points} points and 
                      winning {seasonData.champion.wins} races throughout the season.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Season Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="section-title">Season Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard 
                icon={Flag} 
                value={seasonData.races.length} 
                label="Races" 
              />
              <StatsCard 
                icon={Trophy} 
                value={
                  new Set(seasonData.races.map(race => race.winner.id)).size
                } 
                label="Different Winners" 
              />
              <StatsCard 
                icon={Car} 
                value={
                  new Set(seasonData.races.map(race => race.constructor.id)).size
                } 
                label="Winning Teams" 
              />
              <StatsCard 
                icon={Calendar} 
                value={year} 
                label="Season" 
              />
            </div>
          </motion.section>

          {/* Races Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="section-title">Race Results</h2>
            
            <div className="space-y-6">
              {seasonData.races.map((race, index) => (
                <RaceCard
                  key={`${race.season}-${race.round}`}
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
                  isChampion={
                    seasonData.champion && 
                    race.winner.id === seasonData.champion.driver.id
                  }
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
}