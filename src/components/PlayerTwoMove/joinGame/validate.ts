import { ErrorRecord, ValidationFn } from '../../../hooks/useFormValidation';
import { PlayerMove } from '../../newGame/types';
import { FormState } from './types';

export const validate: ValidationFn<FormState> = (values) => {
  const newErrors: ErrorRecord<FormState> = {};

  if (values.move === PlayerMove.Null)
    newErrors.move = 'Please select your move';

  return newErrors;
};
