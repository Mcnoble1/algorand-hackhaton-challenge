import React from 'react';
import { LayoutGrid, ArrowRightLeft } from 'lucide-react';

interface NavigationProps {
  activeView: 'assets' | 'trading';
  onViewChange: (view: 'assets' | 'trading') => void;
  tradeCount: number;
}

export function Navigation({ activeView, onViewChange, tradeCount }: NavigationProps) {
  return (
    <nav className="flex gap-4 mb-8 bg-white/5 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('assets')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors flex-1 justify-center ${
          activeView === 'assets'
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-white/10'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        Verified Assets
      </button>
      <button
        onClick={() => onViewChange('trading')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors flex-1 justify-center ${
          activeView === 'trading'
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-white/10'
        }`}
      >
        <ArrowRightLeft className="w-5 h-5" />
        Asset Trading
        {tradeCount > 0 && (
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {tradeCount}
          </span>
        )}
      </button>
    </nav>
  );
}