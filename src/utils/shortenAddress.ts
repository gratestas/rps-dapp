import { Address, isAddressEqual } from 'viem';

export function getLabel(
  addressToBeLabeled: Address,
  activeAddress: Address | null
) {
  if (!addressToBeLabeled) return '';
  if (!activeAddress) return shortenAddress(addressToBeLabeled);
  if (isAddressEqual(addressToBeLabeled, activeAddress)) return 'You';
  else return shortenAddress(addressToBeLabeled);
}

export const shortenAddress = (address: Address | null) => {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
