import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './Icons'; // Vamos adicionar estes ícones abaixo

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-indigo-200 hover:bg-white/20 transition-colors"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggleButton;