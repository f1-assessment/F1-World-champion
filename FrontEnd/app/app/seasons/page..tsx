"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getSeasonYears } from "@/lib/utils";

export default function SeasonsPage() {
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const years = getSeasonYears().reverse();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Formula 1 Seasons"
        subtitle="Explore F1 seasons from 2005 to the present day"
        accentWord="Seasons"
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {years.map((year, index) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
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
                    {year < currentYear ? 'Completed Season' : 'Season in Progress'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {year < currentYear 
                    ? `View the complete ${year} Formula 1 season, including the World Champion and all race results.`
                    : `Follow the ongoing ${year} Formula 1 season with up-to-date race results and standings.`
                  }
                </p>
                
                <Link 
                  href={`/seasons/${year}`}
                  className="btn btn-primary w-full flex justify-center items-center"
                >
                  <span>View Season Details</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}