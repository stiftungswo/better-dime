import * as React from 'react';
import { ReactNode } from 'react';
import Input from '@material-ui/core/Input/Input';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { FormProps, ValidatedFormGroupWithLabel } from './common';

interface Props extends FormProps {
  children: ReactNode;
}

export class DurationField extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state.value = this.format;
  }

  public state = {
    value: 0,
  };

  private mode = {
    factor: 60,
    sign: 'h',
  };

  public get format() {
    return this.props.field.value / this.mode.factor;
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ value });
    if (value === '') {
      this.props.form.setFieldValue(this.props.field.name, null);
    } else {
      this.props.form.setFieldValue(this.props.field.name, Number(value) * this.mode.factor);
    }
  };

  public render = () => {
    const { label, field, form, fullWidth = false } = this.props;
    return (
      <ValidatedFormGroupWithLabel label={label} field={field} form={form} fullWidth={fullWidth}>
        <Input
          id={field.name}
          name={field.name}
          type={'number'}
          fullWidth={fullWidth}
          value={this.state.value}
          onChange={this.handleChange}
          endAdornment={<InputAdornment position={'end'}>{this.mode.sign}</InputAdornment>}
        />
      </ValidatedFormGroupWithLabel>
    );
  };
}
