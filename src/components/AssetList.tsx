import React from 'react';
import { Asset } from '../types';
import { CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onOptIn: (assetId: number) => void;
  loading: boolean;
  optedInAssets: Set<number>;
}

export function AssetList({ assets, onOptIn, loading, optedInAssets }: AssetListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300">
          No Verified Assets Found
        </h3>
        <p className="text-gray-400 mt-2">
          Please try again later or check your network connection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white/5 backdrop-blur-sm p-6 rounded-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                {asset.name}
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </h3>
              <p className="text-gray-400 text-sm mt-1">{asset.unit}</p>
              {asset.usdValue && (
                <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {asset.usdValue}
                </p>
              )}
            </div>
            {asset.logo && (
              <img
                src={asset.logo}
                alt={asset.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <button
            onClick={() => onOptIn(asset.id)}
            disabled={optedInAssets.has(asset.id)}
            className={`w-full py-2 rounded-lg transition-colors mt-4 ${
              optedInAssets.has(asset.id)
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            {optedInAssets.has(asset.id) ? 'Opted In' : 'Opt In'}
          </button>
        </div>
      ))}
    </div>
  );
}