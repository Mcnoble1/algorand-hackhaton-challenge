import React, { useState, useCallback, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';
import { toast, Toaster } from 'react-hot-toast';
import { WalletConnect } from './components/WalletConnect';
import { NetworkSelector } from './components/NetworkSelector';
import { AssetList } from './components/AssetList';
import { AccountSelector } from './components/AccountSelector';
import { SearchAndFilter } from './components/SearchAndFilter';
import { TradingView } from './components/Trading/TradingView';
import { Navigation } from './components/Navigation';
import { createAtomicTransfer, validateTrade } from './utils/atomicTransfers';
import { Asset, Trade } from './types';
import { Coins, LogOut, Wallet } from 'lucide-react';

const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: true,
});

function App() {
  const [network, setNetwork] = useState<'MainNet' | 'TestNet'>('TestNet');
  const [account, setAccount] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetType, setAssetType] = useState<'all' | 'collectibles' | 'tokens'>('all');
  const [optedInAssets, setOptedInAssets] = useState<Set<number>>(new Set());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [activeView, setActiveView] = useState<'assets' | 'trading'>('assets');

  const getAlgodClient = useCallback(() => {
    return new algosdk.Algodv2(
      '',
      network === 'TestNet'
        ? 'https://testnet-api.algonode.cloud'
        : 'https://mainnet-api.algonode.cloud',
      ''
    );
  }, [network]);

  const fetchAccountBalance = useCallback(async () => {
    if (!account) return;
    try {
      const client = getAlgodClient();
      const accountInfo = await client.accountInformation(account).do();
      setAccountBalance(accountInfo.amount / 1000000);
      const userAssets = new Set(
        accountInfo.assets?.map((asset: any) => asset['asset-id']) || []
      );
      setOptedInAssets(userAssets);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      toast.error('Failed to fetch account balance');
    }
  }, [account, getAlgodClient]);

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length === 1) {
        setAccount(accounts[0]);
      } else if (accounts.length > 1) {
        setAvailableAccounts(accounts);
        setShowAccountSelector(true);
      }
    });

    peraWallet.connector?.on('disconnect', () => {
      setAccount(null);
      setAvailableAccounts([]);
      setOptedInAssets(new Set());
      toast.success('Wallet disconnected');
    });

    return () => {
      peraWallet.disconnect();
    };
  }, []);

  useEffect(() => {
    if (account) {
      fetchAccountBalance();
    }
  }, [account, network, fetchAccountBalance]);

  const handleAccountSelection = (selectedAccount: string) => {
    setAccount(selectedAccount);
    setShowAccountSelector(false);
    toast.success('Account connected successfully!');
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const accounts = await peraWallet.connect();
      if (accounts.length === 1) {
        setAccount(accounts[0]);
        toast.success('Wallet connected successfully!');
      } else if (accounts.length > 1) {
        setAvailableAccounts(accounts);
        setShowAccountSelector(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect();
    setAccount(null);
    setAvailableAccounts([]);
    setOptedInAssets(new Set());
    toast.success('Wallet disconnected');
  };

  const handleDonation = async () => {
    if (!account) return;

    const toastId = toast.loading('Please sign the transaction in your wallet...');
    try {
      const algodClient = getAlgodClient();
      const params = await algodClient.getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account,
        to: 'A7WMIHZKAA34OFJXN43EEU5PV5C2JJ2X6SNN2H52KSOB2P7KQTYR5O3E3M',
        amount: 1000000,
        note: new Uint8Array(Buffer.from('Pera Challenge Donation')),
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn: txn, signers: [account] }];
      
      toast.loading('Waiting for transaction signature...', { id: toastId });
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      
      toast.loading('Processing donation...', { id: toastId });
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      toast.success('Thank you for your donation!', { id: toastId });
      fetchAccountBalance();
    } catch (error) {
      console.error('Donation failed:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Donation failed. Please try again.',
        { id: toastId }
      );
    }
  };

  const handleOptIn = async (assetId: number) => {
    if (!account) return;

    const toastId = toast.loading('Please sign the opt-in transaction...');
    try {
      const algodClient = getAlgodClient();
      const params = await algodClient.getTransactionParams().do();
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account,
        to: account,
        assetIndex: assetId,
        amount: 0,
        suggestedParams: params,
      });

      const singleTxnGroups = [{ txn: txn, signers: [account] }];
      
      toast.loading('Waiting for transaction signature...', { id: toastId });
      const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
      
      toast.loading('Processing opt-in...', { id: toastId });
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);
      
      toast.success('Successfully opted in to asset!', { id: toastId });
      setOptedInAssets(new Set([...optedInAssets, assetId]));
    } catch (error) {
      console.error('Opt-in failed:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to opt in to asset. Please try again.',
        { id: toastId }
      );
    }
  };

  const handleCreateTrade = async (
    offerAsset: Asset | 'ALGO',
    offerAmount: number,
    requestAsset: Asset | 'ALGO',
    requestAmount: number
  ) => {
    if (!account) return;

    try {
      validateTrade(
        accountBalance,
        optedInAssets,
        offerAsset,
        offerAmount,
        requestAsset
      );

      const newTrade: Trade = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        creator: account,
        offerAsset,
        offerAmount,
        requestAsset,
        requestAmount,
        status: 'active',
        createdAt: Date.now(),
      };

      setTrades((prevTrades) => [...prevTrades, newTrade]);
      toast.success('Trade created successfully!');
      setActiveView('trading');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create trade');
    }
  };

  const handleAcceptTrade = async (trade: Trade) => {
    if (!account || account === trade.creator) return;

    const toastId = toast.loading('Please sign the trade transactions...');
    try {
      const algodClient = getAlgodClient();
      const txGroup = await createAtomicTransfer(
        algodClient,
        trade.creator,
        account,
        trade.offerAsset,
        trade.offerAmount,
        trade.requestAsset,
        trade.requestAmount
      );

      toast.loading('Waiting for transaction signatures...', { id: toastId });
      const signedTxns = await peraWallet.signTransaction([
        { txGroups: txGroup[0], signers: [trade.creator] },
        { txGroups: txGroup[1], signers: [account] },
      ]);

      toast.loading('Processing trade...', { id: toastId });
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setTrades((prevTrades) =>
        prevTrades.map((t) =>
          t.id === trade.id ? { ...t, status: 'completed' } : t
        )
      );

      toast.success('Trade completed successfully!', { id: toastId });
      fetchAccountBalance();
    } catch (error) {
      console.error('Trade failed:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to complete trade. Please try again.',
        { id: toastId }
      );
    }
  };

  const handleCancelTrade = (trade: Trade) => {
    if (!account || account !== trade.creator) return;

    setTrades((prevTrades) =>
      prevTrades.map((t) =>
        t.id === trade.id ? { ...t, status: 'cancelled' } : t
      )
    );
    toast.success('Trade cancelled successfully!');
  };

  const fetchAssets = useCallback(async () => {
    if (!account) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://${network.toLowerCase()}.api.perawallet.app/v1/public/verified-assets/`
      );
      const data = await response.json();

      const verifiedAssetIds = data.results.map((result) => result.asset_id);
      const assetDetailsPromises = verifiedAssetIds.map(fetchAssetDetails);
      const assetDetails = await Promise.all(assetDetailsPromises);
      const validAssets = assetDetails
        .filter((asset): asset is Asset => asset !== null)
        .sort((a, b) => a.name.localeCompare(b.name));

      setAssets(validAssets);
      setFilteredAssets(validAssets);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, [account, network]);

  useEffect(() => {
    if (account) {
      fetchAssets();
    }
  }, [account, network, fetchAssets]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterAssets(term, assetType);
  };

  const handleAssetTypeChange = (type: 'all' | 'collectibles' | 'tokens') => {
    setAssetType(type);
    filterAssets(searchTerm, type);
  };

  const filterAssets = (
    term: string,
    type: 'all' | 'collectibles' | 'tokens'
  ) => {
    let filtered = assets;

    if (type === 'collectibles') {
      filtered = filtered.filter((asset) => asset.isCollectible);
    } else if (type === 'tokens') {
      filtered = filtered.filter((asset) => !asset.isCollectible);
    }

    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchLower) ||
          asset.unit.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAssets(filtered);
  };

  const fetchAssetDetails = async (assetId: number): Promise<Asset | null> => {
    try {
      const response = await fetch(
        `https://${network.toLowerCase()}.api.perawallet.app/v1/public/assets/${assetId}/`
      );
      const data = await response.json();
      return {
        id: assetId,
        name: data.name,
        unit: data.unit_name,
        logo: data.logo,
        decimals: data.fraction_decimals,
        total: data.total_supply,
        verified: true,
        usdValue: data.usd_value,
        verificationTier: data.verification_tier,
        isCollectible: data.is_collectible || false,
      };
    } catch (error) {
      console.error(`Failed to fetch details for asset ${assetId}:`, error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">
            Pera Algorand Challenge
          </h1>

          <div className="flex items-center gap-4">
            <NetworkSelector network={network} onNetworkChange={setNetwork} />
            {!account ? (
              <WalletConnect
                onConnect={connectWallet}
                isConnecting={isConnecting}
              />
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDonation}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <Coins className="w-5 h-5" />
                  Donate 1 ALGO
                </button>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {account && (
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Connected Account
                  </h2>
                  <p className="font-mono text-gray-300">{account}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold mb-2">Balance</h2>
                  <p className="font-mono text-gray-300 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    {accountBalance.toFixed(3)} ALGO
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {account && (
          <>
            <Navigation
              activeView={activeView}
              onViewChange={setActiveView}
              tradeCount={trades.filter(t => t.status === 'active').length}
            />

            {activeView === 'assets' ? (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Verified Assets</h2>
                  <SearchAndFilter
                    onSearch={handleSearch}
                    onAssetTypeChange={handleAssetTypeChange}
                    selectedType={assetType}
                  />
                </div>
                <AssetList
                  assets={filteredAssets}
                  onOptIn={handleOptIn}
                  loading={loading}
                  optedInAssets={optedInAssets}
                />
              </div>
            ) : (
              <TradingView
                optedInAssets={optedInAssets}
                assets={assets}
                accountBalance={accountBalance}
                onCreateTrade={handleCreateTrade}
                onAcceptTrade={handleAcceptTrade}
                onCancelTrade={handleCancelTrade}
                trades={trades.filter((t) => t.status === 'active')}
                loading={loadingTrades}
              />
            )}
          </>
        )}

        {showAccountSelector && (
          <AccountSelector
            accounts={availableAccounts}
            onSelect={handleAccountSelection}
            onClose={() => {
              setShowAccountSelector(false);
              if (!account) {
                disconnectWallet();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;