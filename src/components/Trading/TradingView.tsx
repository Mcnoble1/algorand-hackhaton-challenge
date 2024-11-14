import React, { useState } from 'react';
import { Asset, Trade } from '../../types';
import { CreateTrade } from './CreateTrade';
import { ActiveTrades } from './ActiveTrades';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

interface TradingViewProps {
  optedInAssets: Set<number>;
  assets: Asset[];
  accountBalance: number;
  onCreateTrade: (
    offerAsset: Asset | 'ALGO',
    offerAmount: number,
    requestAsset: Asset | 'ALGO',
    requestAmount: number
  ) => void;
  onAcceptTrade: (trade: Trade) => void;
  onCancelTrade: (trade: Trade) => void;
  trades: Trade[];
  loading: boolean;
}

export function TradingView({
  optedInAssets,
  assets,
  accountBalance,
  onCreateTrade,
  onAcceptTrade,
  onCancelTrade,
  trades,
  loading,
}: TradingViewProps) {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 gap-4 bg-white/5 p-1 rounded-lg">
          <TabsTrigger
            value="create"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            Create Trade
          </TabsTrigger>
          <TabsTrigger
            value="active"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'active'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            Active Trades ({trades.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className={activeTab === 'create' ? 'block' : 'hidden'}>
          <CreateTrade
            optedInAssets={optedInAssets}
            assets={assets}
            accountBalance={accountBalance}
            onCreateTrade={onCreateTrade}
          />
        </TabsContent>

        <TabsContent value="active" className={activeTab === 'active' ? 'block' : 'hidden'}>
          <ActiveTrades
            trades={trades}
            onAcceptTrade={onAcceptTrade}
            onCancelTrade={onCancelTrade}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}