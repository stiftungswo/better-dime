import * as React from 'react';
import { TransformingField, TransformingFieldProps } from './TransformingField';

const factor = 100;
const toString = (n: number) => (n / factor).toFixed(2);
const toValue = (s: string) => Math.round(Number(s) * factor);

const CurrencyField = (props: TransformingFieldProps<number>) => (
  <TransformingField {...props} toString={toString} toValue={toValue} type={'number'} unit={'CHF'} />
);
export default CurrencyField;
