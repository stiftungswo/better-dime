import * as React from 'react';
import { TransformingField, TransformingFieldProps } from './TransformingField';

const factor = 100;
const toString = (n: number) => (n * factor).toFixed(2);
const toValue = (s: string) => Number(s) / factor;

const PercentageField = (props: TransformingFieldProps<number>) =>
  <TransformingField {...props} toText={toString} toValue={toValue} type={'number'} unit={'%'} />;

export default PercentageField;
