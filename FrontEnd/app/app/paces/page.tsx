"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flag, Filter, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RaceCard } from "@/components/race-card";
import { SeasonSelector } from "@/components/season-selector";
import { getSeasonYears } from "@/lib/utils";

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

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const years = getSeasonYears();

  useEffect(() => {
    async function fetchRaces() {
      setLoading(true);
      try {
        const response = await fetch(`/api/seasons/${selectedYear}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch races for ${selectedYear}`);
        }
        const data = await response.json();
        setRaces(data.races || []);
        setFilteredRaces(data.races || []);
      } catch (error) {
        console.error(`Error fetching races for ${selectedYear}:`, error);
        setRaces([]);
        setFilteredRaces([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRaces();
  }, [selectedYear]);

  useEffect(() => {
    if (filter) {
      const filtered = races.filter(
        (race) =>
          race.raceName.toLowerCase().includes(filter.toLowerCase()) ||
          race.circuitName.toLowerCase().includes(filter.toLowerCase()) ||
          race.locality.toLowerCase().includes(filter.toLowerCase()) ||
          race.country.toLowerCase().includes(filter.toLowerCase()) ||
          race.winner.givenName.toLowerCase().includes(filter.toLowerCase()) ||
          race.winner.familyName.toLowerCase().includes(filter.toLowerCase()) ||
          race.constructor.name.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredRaces(filtered);
    } else {
      setFilteredRaces(races);
    }
  }, [races, filter]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Formula 1 Races"
        subtitle={`Explore all F1 races from the ${selectedYear} season`}
        accentWord="Races"
      />

      {/* Filter and Year Selector */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Filter races..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Season:</span>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredRaces.length === 0 ? (
        <div className="text-center py-12">
          <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No races found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter ? "Try adjusting your filter criteria" : `No race data available for the ${selectedYear} season`}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {filteredRaces.map((race, index) => (
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
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}