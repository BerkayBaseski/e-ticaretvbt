import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-[#CBD5E1] hover:text-white"
      title={`Tema: ${theme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'}`}
    >
      {theme === 'dark' ? <Moon className="w-5 h-5 text-[#3B82F6]" /> : <Sun className="w-5 h-5 text-[#F59E0B]" />}
    </Button>
  );
};
