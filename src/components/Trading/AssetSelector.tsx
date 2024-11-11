import React from 'react';
import { Asset } from '../../types';
import { Check } from 'lucide-react';

interface AssetSelectorProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelect: (asset: Asset) => void;
}

export function AssetSelector({ assets, selectedAsset, onSelect }: AssetSelectorProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Select Asset
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            onClick={() => onSelect(asset)}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
              selectedAsset?.id === asset.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {asset.logo && (
              <img
                src={asset.logo}
                alt={asset.name}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="flex-1 text-left truncate">{asset.name}</span>
            {selectedAsset?.id === asset.id && (
              <Check className="w-4 h-4 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}