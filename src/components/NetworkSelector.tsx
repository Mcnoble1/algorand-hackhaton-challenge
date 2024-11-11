import React from 'react';
import { Network } from 'lucide-react';

interface NetworkSelectorProps {
  network: 'MainNet' | 'TestNet';
  onNetworkChange: (network: 'MainNet' | 'TestNet') => void;
}

export function NetworkSelector({ network, onNetworkChange }: NetworkSelectorProps) {
  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-lg">
      <Network className="w-5 h-5 text-gray-400" />
      <select
        value={network}
        onChange={(e) => onNetworkChange(e.target.value as 'MainNet' | 'TestNet')}
        className="bg-transparent text-gray-200 outline-none"
      >
        <option value="MainNet">MainNet</option>
        <option value="TestNet">TestNet</option>
      </select>
    </div>
  );
}