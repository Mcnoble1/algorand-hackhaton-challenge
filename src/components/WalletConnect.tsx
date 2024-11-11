import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export function WalletConnect({ onConnect, isConnecting }: WalletConnectProps) {
  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? 'Connecting...' : 'Connect with Pera'}
    </button>
  );
}