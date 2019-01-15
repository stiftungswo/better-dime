import * as React from 'react';
import { TransformingField, TransformingFieldProps } from './TransformingField';

const factor = 100;
const toString = (n: number) => (n / factor).toFixed(2);
const toValue = (s: string) => Number(s) * factor;

//FIXME this field should always return integers, but doesn't if you enter a value like "120.1212"
const CurrencyField = (props: TransformingFieldProps<number>) => (
  <TransformingField {...props} toString={toString} toValue={toValue} type={'number'} unit={'CHF'} />
);
export default CurrencyField;
