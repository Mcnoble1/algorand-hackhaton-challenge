import React, { useState } from 'react';
import { Asset } from '../../types';
import { AlertCircle, ArrowRightLeft } from 'lucide-react';
import { AssetSelector } from './AssetSelector';
import { toast } from 'react-hot-toast';

interface CreateTradeProps {
  optedInAssets: Set<number>;
  assets: Asset[];
  accountBalance: number;
  onCreateTrade: (
    offerAsset: Asset | 'ALGO',
    offerAmount: number,
    requestAsset: Asset | 'ALGO',
    requestAmount: number
  ) => Promise<void>;
}

export function CreateTrade({
  optedInAssets,
  assets,
  accountBalance,
  onCreateTrade,
}: CreateTradeProps) {
  const [offerType, setOfferType] = useState<'ALGO' | 'ASA'>('ALGO');
  const [requestType, setRequestType] = useState<'ALGO' | 'ASA'>('ASA');
  const [selectedOfferAsset, setSelectedOfferAsset] = useState<Asset | null>(null);
  const [selectedRequestAsset, setSelectedRequestAsset] = useState<Asset | null>(null);
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [requestAmount, setRequestAmount] = useState<string>('');

  const resetForm = () => {
    setOfferType('ALGO');
    setRequestType('ASA');
    setSelectedOfferAsset(null);
    setSelectedRequestAsset(null);
    setOfferAmount('');
    setRequestAmount('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount || !requestAmount) return;

    try {
      const offer = offerType === 'ALGO' ? 'ALGO' : selectedOfferAsset!;
      const request = requestType === 'ALGO' ? 'ALGO' : selectedRequestAsset!;
      
      await onCreateTrade(
        offer,
        parseFloat(offerAmount),
        request,
        parseFloat(requestAmount)
      );

      resetForm();
    } catch (error) {
      console.error('Failed to create trade:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create trade. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ArrowRightLeft className="w-6 h-6" />
        Create Trade
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">You Offer</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOfferType('ALGO')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    offerType === 'ALGO'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ALGO
                </button>
                <button
                  type="button"
                  onClick={() => setOfferType('ASA')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    offerType === 'ASA'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Asset
                </button>
              </div>

              {offerType === 'ASA' && (
                <AssetSelector
                  assets={assets.filter(asset => optedInAssets.has(asset.id))}
                  selectedAsset={selectedOfferAsset}
                  onSelect={setSelectedOfferAsset}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  min="0"
                  step="0.000001"
                  className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Enter amount"
                />
                {offerType === 'ALGO' && (
                  <p className="text-sm text-gray-400 mt-1">
                    Balance: {accountBalance.toFixed(6)} ALGO
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">You Receive</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('ALGO')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    requestType === 'ALGO'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  ALGO
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('ASA')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    requestType === 'ASA'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Asset
                </button>
              </div>

              {requestType === 'ASA' && (
                <AssetSelector
                  assets={assets}
                  selectedAsset={selectedRequestAsset}
                  onSelect={setSelectedRequestAsset}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  min="0"
                  step="0.000001"
                  className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            !offerAmount ||
            !requestAmount ||
            (offerType === 'ASA' && !selectedOfferAsset) ||
            (requestType === 'ASA' && !selectedRequestAsset)
          }
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Trade
        </button>
      </form>
    </div>
  );
}