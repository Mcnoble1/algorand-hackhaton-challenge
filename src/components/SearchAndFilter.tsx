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
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search assets..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 w-64"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onAssetTypeChange('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onAssetTypeChange('collectibles')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'collectibles'
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10'
          }`}
        >
          Collectibles
        </button>
        <button
          onClick={() => onAssetTypeChange('tokens')}
          className={`px-4 py-2 rounded-lg transition-colors ${
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