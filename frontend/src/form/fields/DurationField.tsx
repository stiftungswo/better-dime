import * as React from 'react';
import { FormProps, InputFieldProps, ValidatedFormGroupWithLabel } from './common';
import { TransformingField } from './TransformingField';

const units = {
  hour: {
    sign: 'h',
    factor: 60,
  },
  workday: {
    sign: 'd',
    factor: 504,
  },
};

interface Props extends InputFieldProps {
  timeUnit: keyof typeof units;
}

export class DurationField extends React.Component<Props> {
  public render = () => {
    const { sign, factor } = units[this.props.timeUnit];
    const toString = (n: number) => (n / factor).toFixed(2);
    const toValue = (s: string) => Number(s) * factor;
    return <TransformingField {...this.props} toValue={toValue} toString={toString} type={'number'} unit={sign} />;
  };
}
