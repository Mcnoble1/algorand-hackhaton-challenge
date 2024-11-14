import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onAssetTypeChange: (type: 'all' | 'collectibles' | 'tokens') => void;
  selectedType: 'all' | 'collectibles' | 'tokens';
}

export function SearchAndFilter({
  onSearch,
  onAssetTypeChange,
  selectedType,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
      <div className="relative w-full sm:w-64">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search assets..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
        />
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        <button
          onClick={() => onAssetTypeChange('all')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedType === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onAssetTypeChange('collectibles')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedType === 'collectibles'
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Collectibles
        </button>
        <button
          onClick={() => onAssetTypeChange('tokens')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedType === 'tokens'
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Tokens
        </button>
      </div>
    </div>
  );
}