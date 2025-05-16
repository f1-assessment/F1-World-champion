"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChampionCard } from "@/components/champion-card";

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
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchChampions() {
      try {
        const response = await fetch("/api/champions");
        if (!response.ok) {
          throw new Error("Failed to fetch champions");
        }
        const data = await response.json();
        setChampions(data);
        setFilteredChampions(data);
      } catch (error) {
        console.error("Error fetching champions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChampions();
  }, []);

  useEffect(() => {
    let result = [...champions];
    
    // Apply filter
    if (filter) {
      result = result.filter(
        (champion) =>
          champion.driver.givenName.toLowerCase().includes(filter.toLowerCase()) ||
          champion.driver.familyName.toLowerCase().includes(filter.toLowerCase()) ||
          champion.constructor.name.toLowerCase().includes(filter.toLowerCase()) ||
          champion.driver.nationality.toLowerCase().includes(filter.toLowerCase()) ||
          champion.season.toString().includes(filter)
      );
    }
    
    // Apply sort
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.season - b.season;
      } else {
        return b.season - a.season;
      }
    });
    
    setFilteredChampions(result);
  }, [champions, filter, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
      ) : filteredChampions.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No champions found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filter criteria
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredChampions.map((champion, index) => (
            <ChampionCard
              key={`${champion.season}-${champion.driver.id}`}
              id={champion.id}
              season={champion.season}
              driver={champion.driver}
              constructorTeam={champion.constructor}
              points={champion.points}
              wins={champion.wins}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}