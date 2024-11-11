import algosdk from 'algosdk';
import { Asset } from '../types';

export async function createAtomicTransfer(
  algodClient: algosdk.Algodv2,
  from: string,
  to: string,
  offerAsset: Asset | 'ALGO',
  offerAmount: number,
  requestAsset: Asset | 'ALGO',
  requestAmount: number
) {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create offer transaction
    const offerTxn = offerAsset === 'ALGO'
      ? algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from,
          to,
          amount: Math.floor(offerAmount * 1000000), // Convert to microAlgos
          suggestedParams,
        })
      : algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from,
          to,
          amount: Math.floor(offerAmount * Math.pow(10, offerAsset.decimals)),
          assetIndex: offerAsset.id,
          suggestedParams,
        });

    // Create request transaction
    const requestTxn = requestAsset === 'ALGO'
      ? algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: to,
          to: from,
          amount: Math.floor(requestAmount * 1000000), // Convert to microAlgos
          suggestedParams: {
            ...suggestedParams,
            fee: 1000, // Set explicit fee for second transaction
            flatFee: true,
          },
        })
      : algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: to,
          to: from,
          amount: Math.floor(requestAmount * Math.pow(10, requestAsset.decimals)),
          assetIndex: requestAsset.id,
          suggestedParams: {
            ...suggestedParams,
            fee: 1000, // Set explicit fee for second transaction
            flatFee: true,
          },
        });

    // Group transactions
    const txns = [offerTxn, requestTxn];
    const txGroup = algosdk.assignGroupID(txns);

    // Return transactions as groups for signing
    return [
      [{ txn: txGroup[0], signers: [from] }],
      [{ txn: txGroup[1], signers: [to] }],
    ];
  } catch (error) {
    console.error('Error creating atomic transfer:', error);
    throw new Error('Failed to create atomic transfer. Please try again.');
  }
}

export function validateTrade(
  accountBalance: number,
  optedInAssets: Set<number>,
  offerAsset: Asset | 'ALGO',
  offerAmount: number,
  requestAsset: Asset | 'ALGO'
) {
  // Validate minimum amounts
  if (offerAmount <= 0) {
    throw new Error('Offer amount must be greater than 0');
  }

  // Check if user has sufficient ALGO balance (including fees)
  if (offerAsset === 'ALGO') {
    const requiredAmount = offerAmount + 0.002; // Add 0.002 ALGO for fees
    if (requiredAmount > accountBalance) {
      throw new Error(`Insufficient ALGO balance. You need at least ${requiredAmount.toFixed(3)} ALGO (including fees)`);
    }
  } else if (accountBalance < 0.002) {
    throw new Error('Insufficient ALGO balance for transaction fees');
  }

  // Check if user has opted into the asset they want to receive
  if (requestAsset !== 'ALGO' && !optedInAssets.has(requestAsset.id)) {
    throw new Error(
      `You need to opt-in to ${requestAsset.name} before creating this trade`
    );
  }

  return true;
}