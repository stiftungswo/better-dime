import * as React from 'react';
import { TransformingField, TransformingFieldProps } from './TransformingField';

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

interface Props extends TransformingFieldProps<number> {
  timeUnit: keyof typeof units;
}

export class DurationField extends React.Component<Props> {
  render = () => {
    const { timeUnit, ...rest } = this.props;
    const { sign, factor } = units[timeUnit];
    const toString = (n: number) => (n / factor).toFixed(2);
    const toValue = (s: string) => Number(s) * factor;
    return <TransformingField {...rest} toValue={toValue} toString={toString} type={'number'} unit={sign} />;
  }
}
