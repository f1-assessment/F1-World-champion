"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Monitor, Trophy, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeSelector } from './theme-selector';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Champions', href: '/champions' },
    { name: 'Races', href: '/races' },
    { name: 'Dashboard', href: '/dashboard' },
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

  const ThemeIcon = getThemeIcon();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
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
                      : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              {/* Enhanced Theme Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsThemeOpen(true)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                aria-label="Choose theme"
                title="Theme Settings"
              >
                <div className="relative">
                  <ThemeIcon className="h-5 w-5" />
                  <Palette className="h-3 w-3 absolute -top-1 -right-1 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>

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
                      : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </motion.nav>
          )}
        </div>
      </header>

      {/* Theme Selector Modal */}
      <ThemeSelector isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
    </>
  );
} 