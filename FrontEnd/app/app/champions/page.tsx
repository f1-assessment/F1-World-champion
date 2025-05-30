"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChampionCard } from "@/components/champion-card";
import { apiClient } from "@/lib/api";

interface Champion {
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
}

export default function ChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Separate useEffect for mounting to prevent setState during render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchChampions() {
      try {
        setError(null);
        const data = await apiClient.getAllChampionships();
        
        // Validate and filter the data to ensure all required properties exist
        const validChampions = Array.isArray(data) ? data.filter(champion => 
          champion && 
          champion.id && 
          champion.season && 
          champion.driver && 
          champion.driver.id && 
          champion.constructor && 
          champion.constructor.id
        ) : [];
        
        setChampions(validChampions);
        setFilteredChampions(validChampions);
      } catch (error) {
        console.error("Error fetching champions:", error);
        setError(error instanceof Error ? error.message : "Failed to load champions");
        setChampions([]);
        setFilteredChampions([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch when mounted and not already loading/loaded
    if (mounted && loading) {
      fetchChampions();
    }
  }, [mounted, loading]);

  useEffect(() => {
    let result = [...champions];
    
    // Apply filter - with safety checks for undefined properties
    if (filter) {
      result = result.filter(
        (champion) =>
          champion &&
          champion.driver &&
          champion.constructor &&
          (champion.driver.givenName?.toLowerCase().includes(filter.toLowerCase()) ||
          champion.driver.familyName?.toLowerCase().includes(filter.toLowerCase()) ||
          champion.constructor.name?.toLowerCase().includes(filter.toLowerCase()) ||
          champion.driver.nationality?.toLowerCase().includes(filter.toLowerCase()) ||
          champion.season?.toString().includes(filter))
      );
    }
    
    // Apply sort - with safety checks
    result.sort((a, b) => {
      const seasonA = a?.season || 0;
      const seasonB = b?.season || 0;
      
      if (sortOrder === "asc") {
        return seasonA - seasonB;
      } else {
        return seasonB - seasonA;
      }
    });
    
    setFilteredChampions(result);
  }, [champions, filter, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
        title="Formula 1 World Champions"
        subtitle="Explore all F1 World Champions from 2005 to the present day"
        accentWord="Champions"
      />

      {/* Filter and Sort Controls */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Filter champions..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <button
          onClick={toggleSortOrder}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Trophy className="h-4 w-4" />
          <span>Sort by Year: {sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
        </button>
      </div>

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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Unable to load champions</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : filteredChampions.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            {filter ? "No champions found" : "No champions data available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter ? "Try adjusting your filter criteria" : "Champions data will be displayed when available."}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredChampions
            .filter(champion => champion && champion.id && champion.driver && champion.constructor)
            .map((champion, index) => (
            <ChampionCard
              key={`${champion.season}-${champion.driver?.id || index}`}
              id={champion.id}
              season={champion.season}
              driver={champion.driver}
              constructorTeam={champion.constructor}
              points={champion.points || 0}
              wins={champion.wins || 0}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}