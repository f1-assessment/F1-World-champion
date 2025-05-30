"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  preview: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    icon: Sun,
    preview: {
      bg: 'bg-white',
      primary: 'bg-gray-900',
      secondary: 'bg-gray-600',
      accent: 'bg-red-600'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
    preview: {
      bg: 'bg-gray-900',
      primary: 'bg-white',
      secondary: 'bg-gray-300',
      accent: 'bg-red-500'
    }
  },
  {
    id: 'system',
    name: 'System',
    description: 'Follow system preference',
    icon: Monitor,
    preview: {
      bg: 'bg-gradient-to-br from-white to-gray-100',
      primary: 'bg-gray-900',
      secondary: 'bg-gray-600',
      accent: 'bg-red-600'
    }
  }
];

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Palette className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Choose Theme
                </h2>
              </div>

              <div className="space-y-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeSelect(option.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected 
                              ? 'bg-red-100 dark:bg-red-900/30' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isSelected 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {option.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Theme Preview */}
                          <div className="flex space-x-1">
                            <div className={`w-3 h-3 rounded-full ${option.preview.bg} border border-gray-300 dark:border-gray-600`} />
                            <div className={`w-3 h-3 rounded-full ${option.preview.primary}`} />
                            <div className={`w-3 h-3 rounded-full ${option.preview.accent}`} />
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Theme preference is saved locally and will persist across sessions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick theme toggle button component
export function QuickThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return Moon;
      case 'light':
        return Sun;
      case 'system':
      default:
        return Monitor;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Current theme: ${theme}`}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
} 