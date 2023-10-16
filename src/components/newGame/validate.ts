import { Address, isAddressEqual } from 'viem';
import { ErrorRecord, ValidationFn } from '../../hooks/useFormValidation';
import { GameFormState, PlayerMove } from './types';

export const validate: ValidationFn<GameFormState, Address> = (
  values,
  account
) => {
  const newErrors: ErrorRecord<GameFormState> = {};

  if (Number(values.move) === PlayerMove.Null)
    newErrors.move = 'Please select your move.';
  // if (values.salt === null) newErrors.salt = 'Please enter a secret code.';
  if (values.player2Address === '') {
    newErrors.player2Address = 'Please enter Player 2 address.';
  } else if (!isValidAddress(values.player2Address!)) {
    newErrors.player2Address = 'Please enter a valid address';
  } else if (
    account &&
    isAddressEqual(values.player2Address! as Address, account!)
  ) {
    newErrors.player2Address =
      'Player 2 address cannot be the same as your account address';
  }

  if (values.stake === '') newErrors.stake = 'Please enter a bet amount.';

  return newErrors;
};

export const isValidAddress = (address: string): boolean => {
  const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  return addressRegex.test(address);
};
