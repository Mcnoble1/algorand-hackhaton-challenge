import React from 'react';
import { LayoutGrid, ArrowRightLeft } from 'lucide-react';

interface NavigationProps {
  activeView: 'assets' | 'trading';
  onViewChange: (view: 'assets' | 'trading') => void;
  tradeCount: number;
}

export function Navigation({ activeView, onViewChange, tradeCount }: NavigationProps) {
  return (
    <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 bg-white/5 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('assets')}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors flex-1 ${
          activeView === 'assets'
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-white/10'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span>Verified Assets</span>
      </button>
      <button
        onClick={() => onViewChange('trading')}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors flex-1 ${
          activeView === 'trading'
            ? 'bg-purple-600 text-white'
            : 'text-gray-300 hover:bg-white/10'
        }`}
      >
        <ArrowRightLeft className="w-5 h-5" />
        <span>Asset Trading</span>
        {tradeCount > 0 && (
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {tradeCount}
          </span>
        )}
      </button>
    </nav>
  );
}