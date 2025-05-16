"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Trophy, Calendar, Clock, MapPin, Flag, 
  Car, Award, ArrowLeft, ChevronRight, ChevronLeft 
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCountryFlag, formatDate } from "@/lib/utils";

interface RaceData {
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
  timeMillis: string | null;
  fastestLapRank: number | null;
  fastestLap: number | null;
  fastestLapTime: string | null;
  fastestLapSpeed: string | null;
}

export default function RaceDetailsPage({ 
  params 
}: { 
  params: { year: string; round: string } 
}) {
  const [race, setRace] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seasonRaces, setSeasonRaces] = useState<{ round: number; raceName: string }[]>([]);
  const year = parseInt(params.year);
  const round = parseInt(params.round);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    async function fetchRaceData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/seasons/${year}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${year}`);
        }
        const data = await response.json();
        
        // Find the specific race
        const raceData = data.races.find((r: any) => r.round === round) || null;
        setRace(raceData);
        
        // Get all races for navigation
        setSeasonRaces(
          data.races.map((r: any) => ({ 
            round: r.round, 
            raceName: r.raceName 
          }))
        );
      } catch (error) {
        console.error(`Error fetching race data:`, error);
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(year) && !isNaN(round)) {
      fetchRaceData();
    }
  }, [year, round]);

  if (isNaN(year) || isNaN(round)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Invalid Race</h1>
        <p>The requested race is not valid.</p>
      </div>
    );
  }

  // Find previous and next races
  const currentIndex = seasonRaces.findIndex(r => r.round === round);
  const prevRace = currentIndex > 0 ? seasonRaces[currentIndex - 1] : null;
  const nextRace = currentIndex < seasonRaces.length - 1 ? seasonRaces[currentIndex + 1] : null;

  const circuitImageUrl = race 
    ? `https://i.redd.it/0rh4214apqb71.png Formula 1 circuit aerial view}`
    : "";

  const driverImageUrl = race 
    ? `https://i.ytimg.com/vi/ihaSwqtWzck/maxresdefault.jpg ${race.winner.familyName} portrait}`
    : "";

  const carImageUrl = race 
    ? `https://i.pinimg.com/736x/6d/bd/d1/6dbdd1b266b0ab3414f17c0e7519d915--posters-vintage-racing.jpg Formula 1 team ${year} car}`
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link 
          href={`/seasons/${year}`}
          className="inline-flex items-center text-red-600 dark:text-red-500 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {year} Season
        </Link>
        
        {race && (
          <PageHeader 
            title={race.raceName}
            subtitle={`Round ${race.round} of the ${race.season} Formula 1 Season`}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : !race ? (
        <div className="text-center py-12">
          <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Race not found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We couldn't find data for this race
          </p>
        </div>
      ) : (
        <div ref={ref}>
          {/* Race Info Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Flag className="h-6 w-6 mr-2" />
                Race Information
              </h2>
            </div>
            
            <div className="p-6 md:flex">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden mb-6">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${circuitImageUrl})` }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-lg">{formatDate(race.date)}</span>
                  </div>
                  
                  {race.time && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      <span className="text-lg">{new Date(race.time).toLocaleTimeString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-lg flex items-center">
                      {race.locality}, {race.country}
                      <img 
                        src={getCountryFlag(race.country)} 
                        alt={race.country} 
                        className="h-4 ml-2" 
                      />
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-lg">{race.circuitName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-lg">Round {race.round} of {seasonRaces.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-4">Race Winner</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative mr-4">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${driverImageUrl})` }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-xl font-bold">
                        {race.winner.givenName} {race.winner.familyName}
                      </h4>
                      <img 
                        src={getCountryFlag(race.winner.nationality)} 
                        alt={race.winner.nationality} 
                        className="h-4 ml-2" 
                      />
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {race.constructor.name}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Starting Position</div>
                    <div className="font-bold text-lg">{race.grid}</div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Laps Completed</div>
                    <div className="font-bold text-lg">{race.laps}</div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="font-bold text-lg">{race.status}</div>
                  </div>
                  
                  {race.fastestLap && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fastest Lap</div>
                      <div className="font-bold text-lg">Lap {race.fastestLap}</div>
                    </div>
                  )}
                </div>
                
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${carImageUrl})` }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Race Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-between items-center"
          >
            {prevRace ? (
              <Link 
                href={`/races/${year}/${prevRace.round}`}
                className="btn btn-secondary flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Previous: {prevRace.raceName}</span>
              </Link>
            ) : (
              <div></div>
            )}
            
            {nextRace ? (
              <Link 
                href={`/races/${year}/${nextRace.round}`}
                className="btn btn-secondary flex items-center"
              >
                <span>Next: {nextRace.raceName}</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <div></div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}