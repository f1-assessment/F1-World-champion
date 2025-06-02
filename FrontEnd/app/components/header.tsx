"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Monitor, Trophy, Palette, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Champions', href: '/champions' },
    { name: 'Races', href: '/races' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
    },
    {
      id: 'system',
      name: 'System',
      description: 'Follow system preference',
      icon: Monitor,
    }
  ];

  const isActive = (href: string) => pathname === href;

  const getThemeIcon = () => {
    if (!mounted) return Sun;
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

  const getCurrentTheme = () => {
    if (!mounted) return themeOptions[0];
    return themeOptions.find(t => t.id === theme) || themeOptions[0];
  };

  const ThemeIcon = getThemeIcon();
  const currentTheme = getCurrentTheme();

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsThemeOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              F1 Champions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Dropdown & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Theme Dropdown */}
            <div className="relative" ref={themeRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Choose theme"
              >
                <ThemeIcon className="h-4 w-4" />
                <span className="hidden sm:block text-sm font-medium">
                  {mounted ? currentTheme.name : 'Theme'}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Theme Dropdown Menu */}
              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Palette className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Choose Theme
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = theme === option.id;

                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ x: 4 }}
                            onClick={() => handleThemeSelect(option.id)}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                              isSelected ? 'bg-red-50 dark:bg-red-900/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-1.5 rounded-md ${
                                  isSelected 
                                    ? 'bg-red-100 dark:bg-red-900/30' 
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <Icon className={`h-4 w-4 ${
                                    isSelected 
                                      ? 'text-red-600 dark:text-red-400' 
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {option.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-4 w-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Theme preference is saved locally
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
} 