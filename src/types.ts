export interface Asset {
  id: number;
  name: string;
  unit: string;
  logo?: string;
  decimals: number;
  total: number;
  verified: boolean;
  usdValue?: string;
  verificationTier: string;
  isCollectible?: boolean;
}

export interface VerifiedAssetList {
  next: string | null;
  previous: string | null;
  results: {
    asset_id: number;
    verification_tier: string;
  }[];
}

export interface AssetDetails {
  name: string;
  unit_name: string;
  logo: string;
  verification_tier: string;
  usd_value: string;
  verification_details?: {
    project_name: string;
    project_url: string;
    project_description: string;
  };
  total_supply: number;
  fraction_decimals: number;
  is_collectible?: boolean;
}

export interface AccountInfo {
  address: string;
  assets: Asset[];
  amount: number;
}

export interface Trade {
  id: string;
  creator: string;
  offerAsset: Asset | 'ALGO';
  offerAmount: number;
  requestAsset: Asset | 'ALGO';
  requestAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
}