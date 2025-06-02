"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";
import { Trophy, Flag, Calendar, Users, Award, Car } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatsCard } from "@/components/ui/stats-card";
import { ChampionCard } from "@/components/champion-card";
import { getCountryFlag } from "@/lib/utils";
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

export default function Home() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
        ).slice(0, 4) : [];
        
        setChampions(validChampions);
      } catch (error) {
        console.error("Error fetching champions:", error);
        setError(error instanceof Error ? error.message : "Failed to load champions");
        // Set empty array on error
        setChampions([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch when mounted and not already loading/loaded
    if (mounted && loading) {
      fetchChampions();
    }
  }, [mounted, loading]);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  console.log(champions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          {/* Light theme image */}
          <Image
            src="/images/f1-hero-background-white.png"
            alt="Formula 1 Racing - Dynamic cars with light trails (Light Theme)"
            fill
            className={`object-cover transition-opacity duration-700 ${
              resolvedTheme === 'dark' ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          
          {/* Dark theme image */}
          <Image
            src="/images/f1-hero-background-dark.png"
            alt="Formula 1 Racing - Dynamic cars with light trails (Dark Theme)"
            fill
            className={`object-cover transition-opacity duration-700 ${
              resolvedTheme === 'dark' ? 'opacity-100' : 'opacity-0'
            }`}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          
          {/* Theme-aware gradient overlay */}
          {/* OPTION 1: Subtle gradient for light theme (ACTIVE) */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            resolvedTheme === 'dark' 
              ? 'bg-gradient-to-r from-black/80 via-black/60 to-transparent'
              : 'bg-gradient-to-r from-gray-900/10 via-transparent to-transparent'
          }`} />
          
          {/* OPTION 2: No gradient for light theme (DISABLED) */}
          {/* 
          {resolvedTheme === 'dark' && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent transition-opacity duration-700" />
          )}
          */}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transition-colors duration-700 ${
              resolvedTheme === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            }`}>
              F1 World <span className="text-red-600">Champions</span>
            </h1>
            <p className={`text-xl mb-8 transition-colors duration-700 ${
              resolvedTheme === 'dark' 
                ? 'text-gray-200' 
                : 'text-gray-700'
            }`}>
              Explore Formula 1 World Champions from 2005 to the present day. 
              Discover race winners, championship statistics, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/champions" className="btn btn-primary">
                View Champions
              </Link>
              <Link href="/seasons" className={`btn transition-colors duration-300 ${
                resolvedTheme === 'dark'
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                Explore Seasons
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              icon={Trophy} 
              value={champions.length} 
              label="World Champions" 
            />
            <StatsCard 
              icon={Flag} 
              value={20} 
              label="Races Per Season" 
            />
            <StatsCard 
              icon={Users} 
              value={10} 
              label="Teams Competing" 
            />
            <StatsCard 
              icon={Award} 
              value={20} 
              label="Drivers on Grid" 
            />
          </div>
        </div>
      </section>

      {/* Recent Champions Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Recent Champions</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore the most recent Formula 1 World Champions and their achievements.
            </p>
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
          ) : champions.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No champions data available</h3>
              <p className="text-gray-600 dark:text-gray-400">Champions data will be displayed when available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {champions
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
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/champions" className="btn btn-primary">
              View All Champions
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore F1 History</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dive into the rich history of Formula 1 with our comprehensive database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6 transition-colors duration-300"
            >
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Champions</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Explore all Formula 1 World Champions from 2005 to the present day, 
                including their teams, points, and race wins.
              </p>
              <Link href="/champions" className="text-red-600 dark:text-red-500 font-medium hover:underline">
                View Champions →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6 transition-colors duration-300"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Seasons</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse through each Formula 1 season, see the championship standings, 
                and discover all race winners for each year.
              </p>
              <Link href="/seasons" className="text-red-600 dark:text-red-500 font-medium hover:underline">
                Explore Seasons →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6 transition-colors duration-300"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Flag className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Races</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dive into detailed race information, including winners, circuits, 
                and race statistics for every Grand Prix.
              </p>
              <Link href="/races" className="text-red-600 dark:text-red-500 font-medium hover:underline">
                View Races →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:max-w-2xl mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to explore F1 history?
                </h2>
                <p className="text-white/90 text-lg">
                  Discover all Formula 1 World Champions, race winners, and statistics from 2005 to the present day.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/champions" className="btn bg-white text-red-600 hover:bg-gray-100 transition-colors duration-300">
                  View Champions
                </Link>
                <Link href="/seasons" className="btn bg-transparent text-white border border-white hover:bg-white/10 transition-colors duration-300">
                  Explore Seasons
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}