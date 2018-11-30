import * as React from 'react';
import { ReactNode } from 'react';
import { FormProps, InputFieldWithValidation } from './common';

const factor = 0.01;

interface Props extends FormProps {
  children: ReactNode;
}

export default class PercentageField extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state.value = this.format;
  }

  public state = {
    value: '',
  };

  public get format() {
    return (this.props.field.value / factor).toFixed(2);
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ value });
    if (value === '') {
      this.props.form.setFieldValue(this.props.field.name, null);
    } else {
      this.props.form.setFieldValue(this.props.field.name, Number(value) * factor);
    }
  };

  public render = () => {
    return <InputFieldWithValidation {...this.props} type={'number'} value={this.state.value} onChange={this.handleChange} unit={'%'} />;
  };
}
