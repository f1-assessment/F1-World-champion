"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { 
  Trophy, Flag, Calendar, Users, Award, Car, 
  BarChart3, PieChart, LineChart, TrendingUp 
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatsCard } from "@/components/ui/stats-card";
import { getCountryFlag, getConstructorColor } from "@/lib/utils";
import { apiClient } from "@/lib/api";

// Dynamically import charts with SSR disabled
const PieChart2 = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Pie),
  { ssr: false, loading: () => <div className="h-80 flex items-center justify-center"><LoadingSpinner /></div> }
);

const BarChart2 = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Bar),
  { ssr: false, loading: () => <div className="h-80 flex items-center justify-center"><LoadingSpinner /></div> }
);

const LineChart2 = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false, loading: () => <div className="h-80 flex items-center justify-center"><LoadingSpinner /></div> }
);

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
}

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

export default function DashboardPage() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Separate useEffect for mounting to prevent setState during render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        // Fetch champions
        const championsData = await apiClient.getAllChampionships();
        
        // Validate and filter the champions data
        const validChampions = Array.isArray(championsData) ? championsData.filter(champion => 
          champion && 
          champion.id && 
          champion.season && 
          champion.driver && 
          champion.driver.id && 
          champion.constructor && 
          champion.constructor.id
        ) : [];
        
        setChampions(validChampions);
        
        // Fetch races for the current year
        const currentYear = new Date().getFullYear();
        try {
          const racesData = await apiClient.getRacesBySeason(currentYear);
          setRaces(racesData || []);
        } catch (raceError) {
          console.warn("Could not fetch current season races:", raceError);
          // Don't throw here as this is optional data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Failed to load dashboard data");
        setChampions([]);
        setRaces([]);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch when mounted and not already loading/loaded
    if (mounted && loading) {
      fetchData();
    }
  }, [mounted, loading]);

  // Prepare data for charts - with safety checks
  const championsByConstructor = champions.reduce((acc: Record<string, number>, champion) => {
    if (champion && champion.constructor && champion.constructor.name) {
      const constructor = champion.constructor.name;
      acc[constructor] = (acc[constructor] || 0) + 1;
    }
    return acc;
  }, {});

  const championsByNationality = champions.reduce((acc: Record<string, number>, champion) => {
    if (champion && champion.driver && champion.driver.nationality) {
      const nationality = champion.driver.nationality;
      acc[nationality] = (acc[nationality] || 0) + 1;
    }
    return acc;
  }, {});

  const pointsOverYears = champions
    .filter(champion => champion && champion.season && champion.points)
    .sort((a, b) => a.season - b.season)
    .map(champion => ({
      year: champion.season,
      points: champion.points
    }));

  const winsDistribution = champions
    .filter(champion => champion && champion.driver && champion.wins !== undefined)
    .map(champion => ({
      driver: `${champion.driver.givenName || ''} ${champion.driver.familyName || ''}`.trim(),
      season: champion.season,
      wins: champion.wins
    }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <PageHeader 
        title="F1 Champions Dashboard"
        subtitle="Visualize Formula 1 championship data and statistics"
        accentWord="Dashboard"
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Unable to load dashboard</h3>
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
          <p className="text-gray-600 dark:text-gray-400">Dashboard data will be displayed when available.</p>
        </div>
      ) : (
        <div ref={ref}>
          {/* Stats Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard 
                icon={Trophy} 
                value={champions.length} 
                label="World Champions" 
              />
              <StatsCard 
                icon={Car} 
                value={Object.keys(championsByConstructor).length} 
                label="Winning Constructors" 
              />
              <StatsCard 
                icon={Flag} 
                value={Object.keys(championsByNationality).length} 
                label="Champion Nationalities" 
              />
              <StatsCard 
                icon={Award} 
                value={champions.reduce((acc, champion) => acc + champion.wins, 0)} 
                label="Total Race Wins" 
              />
            </div>
          </motion.section>

          {/* Charts Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="section-title">Championship Analysis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Constructor Championships */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="h-6 w-6 text-red-600 dark:text-red-500 mr-2" />
                  <h3 className="text-xl font-bold">Championships by Constructor</h3>
                </div>
                <div className="h-80">
                  <PieChart2
                    data={{
                      labels: Object.keys(championsByConstructor),
                      datasets: [
                        {
                          data: Object.values(championsByConstructor),
                          backgroundColor: Object.keys(championsByConstructor).map(
                            constructor => getConstructorColor(constructor)
                          ),
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 15,
                            padding: 15
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value} championships`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Driver Nationalities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-500 mr-2" />
                  <h3 className="text-xl font-bold">Championships by Nationality</h3>
                </div>
                <div className="h-80">
                  <BarChart2
                    data={{
                      labels: Object.keys(championsByNationality),
                      datasets: [
                        {
                          label: 'Championships',
                          data: Object.values(championsByNationality),
                          backgroundColor: 'rgba(220, 0, 0, 0.7)',
                          borderColor: 'rgba(220, 0, 0, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const value = context.raw || 0;
                              return `${value} championship${value !== 1 ? 's' : ''}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Evolution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <LineChart className="h-6 w-6 text-green-600 dark:text-green-500 mr-2" />
                  <h3 className="text-xl font-bold">Championship Points Evolution</h3>
                </div>
                <div className="h-80">
                  <LineChart2
                    data={{
                      labels: pointsOverYears.map(item => item.year),
                      datasets: [
                        {
                          label: 'Champion Points',
                          data: pointsOverYears.map(item => item.points),
                          fill: true,
                          backgroundColor: 'rgba(220, 0, 0, 0.1)',
                          borderColor: 'rgba(220, 0, 0, 1)',
                          tension: 0.4
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: false
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Wins Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold">Race Wins by Champion</h3>
                </div>
                <div className="h-80">
                  <BarChart2
                    data={{
                      labels: winsDistribution.map(item => `${item.driver} (${item.season})`),
                      datasets: [
                        {
                          label: 'Race Wins',
                          data: winsDistribution.map(item => item.wins),
                          backgroundColor: 'rgba(0, 30, 80, 0.7)',
                          borderColor: 'rgba(0, 30, 80, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Recent Data */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="section-title">Recent Champions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nationality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Constructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {champions
                    .filter(champion => champion && champion.id && champion.driver && champion.constructor)
                    .slice(0, 10)
                    .map((champion) => (
                    <tr 
                      key={`${champion.season}-${champion.driver?.id || 'unknown'}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{champion.season || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {champion.driver?.givenName || ''} {champion.driver?.familyName || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <img 
                            src={getCountryFlag(champion.driver?.nationality || '')} 
                            alt={champion.driver?.nationality || ''} 
                            className="h-4 mr-2" 
                          />
                          {champion.driver?.nationality || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{champion.constructor?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{champion.points || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{champion.wins || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      )}
    </div>
  );
}