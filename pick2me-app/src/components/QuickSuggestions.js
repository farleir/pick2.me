import React from 'react';

// Categorias baseadas em pesquisas de e-commerce no Brasil.
const categories = [
  "Celular",
  "Notebook",
  "Mochila",
  "Eletrodoméstico",
  "TV"
];

const QuickSuggestions = ({ onSuggestionClick }) => {
  return (
    <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSuggestionClick(category)}
          className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-full transition-colors duration-200"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default QuickSuggestions;