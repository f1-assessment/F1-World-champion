"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Trophy, Flag, Calendar, Users, Award, Car } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatsCard } from "@/components/ui/stats-card";
import { ChampionCard } from "@/components/champion-card";
import { getCountryFlag } from "@/lib/utils";

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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    async function fetchChampions() {
      try {
        const response = await fetch("/api/champions");
        if (!response.ok) {
          throw new Error("Failed to fetch champions");
        }
        const data = await response.json();
        setChampions(data.slice(0, 4)); // Get the 4 most recent champions
      } catch (error) {
        console.error("Error fetching champions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChampions();
  }, []);

  const heroImageUrl = "https://img.freepik.com/premium-photo/highspeed-formula-one-race-car-racing-track-with-motion-blur-background-dramatic-lighting_698249-3705.jpg";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl}
            alt="Formula 1 Racing"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              F1 World <span className="text-red-600">Champions</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Explore Formula 1 World Champions from 2005 to the present day. 
              Discover race winners, championship statistics, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/champions" className="btn btn-primary">
                View Champions
              </Link>
              <Link href="/seasons" className="btn bg-white text-gray-900 hover:bg-gray-100">
                Explore Seasons
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
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
      <section className="py-16">
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {champions.map((champion, index) => (
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
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Champions</h3>
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seasons</h3>
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Flag className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Races</h3>
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
      <section className="py-16">
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
                <Link href="/champions" className="btn bg-white text-red-600 hover:bg-gray-100">
                  View Champions
                </Link>
                <Link href="/seasons" className="btn bg-transparent text-white border border-white hover:bg-white/10">
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