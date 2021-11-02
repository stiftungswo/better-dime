import * as React from 'react';
import { TransformingField, TransformingFieldProps } from './TransformingField';

const factor = 100;
const toString = (digits: number) => (n: number) => (n * factor).toFixed(digits);
const toValue = (s: string) => Number(s) / factor;

const PercentageField = (props: TransformingFieldProps<number> & {digits?: number}) => {
  const {digits = 2, ...rest} = props;
  return (
    <TransformingField disableUpDown {...rest} toString={toString(digits)} toValue={toValue} type={'number'} unit={'%'} />
  );
};
// vats only have 1 decimal digit
export const VatField = (props: TransformingFieldProps<number>) => PercentageField({digits: 1, ...props});
export default PercentageField;
