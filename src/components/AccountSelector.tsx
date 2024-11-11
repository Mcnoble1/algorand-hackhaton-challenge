import React from 'react';
import { X } from 'lucide-react';

interface AccountSelectorProps {
  accounts: string[];
  onSelect: (account: string) => void;
  onClose: () => void;
}

export function AccountSelector({ accounts, onSelect, onClose }: AccountSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-white">Select Account</h2>
        <p className="text-gray-300 mb-6">Choose an account to connect with this dApp:</p>
        
        <div className="space-y-2">
          {accounts.map((account) => (
            <button
              key={account}
              onClick={() => onSelect(account)}
              className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white font-mono text-sm break-all"
            >
              {account}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}