"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, ChevronRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiClient } from "@/lib/api";
import { Season } from "@/lib/types";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      setError(null);
      setLoading(true);
      const seasonsData = await apiClient.getAllSeasons();
      
      // Sort seasons by year in descending order (most recent first)
      const sortedSeasons = seasonsData.sort((a: Season, b: Season) => 
        parseInt(b.season) - parseInt(a.season)
      );
      
      setSeasons(sortedSeasons);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setError(error instanceof Error ? error.message : "Failed to load seasons");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeasons = async () => {
    try {
      setUpdating(true);
      setError(null);
      await apiClient.updateSeasonsData();
      // Refresh the seasons list after update
      await fetchSeasons();
    } catch (error) {
      console.error("Error updating seasons:", error);
      setError(error instanceof Error ? error.message : "Failed to update seasons");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <PageHeader 
        title="Formula 1 Seasons"
        subtitle={`Explore F1 seasons from 1950 to the present day (${seasons.length} seasons available)`}
        accentWord="Seasons"
      />

      {/* Update Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleUpdateSeasons}
          disabled={updating}
          className="btn btn-outline flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} />
          <span>{updating ? 'Updating...' : 'Update Seasons'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchSeasons}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : seasons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No seasons data available.</p>
          <button onClick={handleUpdateSeasons} className="btn btn-primary">
            Load Seasons Data
          </button>
        </div>
      ) : (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {seasons.map((season, index) => {
            const year = parseInt(season.season);
            return (
              <motion.div
                key={season.season}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                className={`card ${year === currentYear ? 'border-2 border-red-500' : ''}`}
              >
                <div className="card-header flex justify-between items-center">
                  <h3 className="text-xl font-bold">{year} Season</h3>
                  {year === currentYear && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Current</span>
                  )}
                </div>
                
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {year < currentYear ? 'Completed Season' : year > currentYear ? 'Future Season' : 'Season in Progress'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {year < currentYear 
                      ? `View the complete ${year} Formula 1 season, including the World Champion and all race results.`
                      : year > currentYear
                      ? `The ${year} Formula 1 season is scheduled for the future.`
                      : `Follow the ongoing ${year} Formula 1 season with up-to-date race results and standings.`
                    }
                  </p>
                  
                  <div className="space-y-2">
                    <Link 
                      href={`/seasons/${year}`}
                      className="btn btn-primary w-full flex justify-center items-center"
                    >
                      <span>View Season Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                    
                    {season.url && (
                      <a
                        href={season.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline w-full text-center text-sm"
                      >
                        Wikipedia →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}