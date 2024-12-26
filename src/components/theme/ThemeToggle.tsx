import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;