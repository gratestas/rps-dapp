import { ErrorRecord, ValidationFn } from '../../../hooks/useFormValidation';
import { PlayerMove } from '../../newGame/types';
import { RevealFormState } from './types';

export const validate: ValidationFn<RevealFormState, boolean> = (values) => {
  const newErrors: ErrorRecord<RevealFormState> = {};

  if (values.move === PlayerMove.Null)
    newErrors.move = 'Please select your move';
  if (values.salt === null) newErrors.salt = 'Please enter your secret code';
  return newErrors;
};
