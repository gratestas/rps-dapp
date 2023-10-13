import { useState } from 'react';

export type ValidationFn<T> = (values: T) => Partial<Record<keyof T, string>>;
export type ErrorRecord<T> = Partial<Record<keyof T, string>>;
type ToucedRecord<T> = Partial<Record<keyof T, boolean>>;

type Props<T> = {
  initialValues: T;
  validate: ValidationFn<T>;
};
type FormValidationReturn<T> = {
  values: T;
  errors: ErrorRecord<T>;
  touched: ToucedRecord<T>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement & HTMLSelectElement>
  ) => void;
};

const useFormValidation = <T extends Record<keyof T, any> = {}>({
  initialValues,
  validate,
}: Props<T>): FormValidationReturn<T> => {
  const [values, setValues] = useState<T>((initialValues || {}) as T);
  const [errors, setErrors] = useState<ErrorRecord<T>>(validate(values));
  const [touched, setTouched] = useState<ToucedRecord<T>>({} as T);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newErrors = validate({ ...values, [name]: value });
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name as keyof T] || '' });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  return { values, errors, touched, handleChange, handleBlur };
};

export default useFormValidation;
