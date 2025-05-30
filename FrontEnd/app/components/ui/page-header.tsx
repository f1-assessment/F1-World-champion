import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  accentWord?: string;
}

export function PageHeader({ title, subtitle, accentWord }: PageHeaderProps) {
  const getHighlightedTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return title;
    }

    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="text-red-600 dark:text-red-400">{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {getHighlightedTitle()}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
} 