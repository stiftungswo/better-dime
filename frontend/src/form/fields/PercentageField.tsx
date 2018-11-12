import * as React from 'react';
import { ReactNode } from 'react';
import { FormProps, InputFieldWithValidation } from './common';

const factor = 0.01;

export default class PercentageField extends React.Component<FormProps & { children: ReactNode }> {
  constructor(props: any) {
    super(props);
    this.state.value = this.format;
  }

  public state = {
    value: '',
  };

  public get format() {
    return (this.props.field.value / factor).toFixed(2);
  }

  public handleChange = (e: any) => {
    const value = e.target.value;
    this.setState({ value });
    if (value === '') {
      this.props.form.setFieldValue(this.props.field.name, null);
    } else {
      this.props.form.setFieldValue(this.props.field.name, value * factor);
    }
  };

  public render = () => {
    return <InputFieldWithValidation {...this.props} type={'number'} value={this.state.value} onChange={this.handleChange} unit={'%'} />;
  };
}
