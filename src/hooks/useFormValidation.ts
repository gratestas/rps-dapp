import { useState } from 'react';

export type ValidationFn<T, U = any> = (
  values: Partial<T>,
  optionalArg?: U
) => Partial<Record<keyof T, string>>;

export type ErrorRecord<T> = Partial<Record<keyof T, string>>;
type TouchedRecord<T> = Partial<Record<keyof T, boolean>>;

type Props<T> = {
  initialValues: T;
  validate: ValidationFn<T>;
};
type FormValidationReturn<T> = {
  values: T;
  errors: ErrorRecord<T>;
  touched: TouchedRecord<T>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement & HTMLSelectElement>
  ) => void;
  hasError: boolean;
};

const useFormValidation = <T extends Record<keyof T, any>, U = any>({
  initialValues,
  validate,
  optionalArg,
}: Props<T> & { optionalArg?: U }): FormValidationReturn<T> => {
  const [values, setValues] = useState<T>((initialValues || {}) as T);
  const [touched, setTouched] = useState<TouchedRecord<T>>({} as T);
  const [errors, setErrors] = useState<ErrorRecord<T>>(
    validate(values, optionalArg)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newErrors = validate({ ...values, [name]: value }, optionalArg);
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name as keyof T] || '' });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const hasError = Object.keys(errors).some((error) => error !== '');

  return { values, errors, hasError, touched, handleChange, handleBlur };
};

export default useFormValidation;
