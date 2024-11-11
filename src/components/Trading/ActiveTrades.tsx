import React from 'react';
import { Trade } from '../../types';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface ActiveTradesProps {
  trades: Trade[];
  onAcceptTrade: (trade: Trade) => void;
  onCancelTrade: (trade: Trade) => void;
  loading: boolean;
}

export function ActiveTrades({
  trades,
  onAcceptTrade,
  onCancelTrade,
  loading,
}: ActiveTradesProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-lg">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Active Trades
        </h3>
        <p className="text-gray-400">
          Create a new trade to get started with asset trading.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="bg-white/5 backdrop-blur-sm p-6 rounded-lg hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">From</p>
                <p className="font-mono text-sm truncate max-w-[200px]">
                  {trade.creator}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-sm">
                  {new Date(trade.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Offering</h4>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="font-medium">
                  {trade.offerAmount}{' '}
                  {trade.offerAsset === 'ALGO'
                    ? 'ALGO'
                    : trade.offerAsset.name}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Requesting
              </h4>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="font-medium">
                  {trade.requestAmount}{' '}
                  {trade.requestAsset === 'ALGO'
                    ? 'ALGO'
                    : trade.requestAsset.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onAcceptTrade(trade)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Accept Trade
            </button>
            {trade.creator === window.localStorage.getItem('walletAddress') && (
              <button
                onClick={() => onCancelTrade(trade)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel Trade
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}