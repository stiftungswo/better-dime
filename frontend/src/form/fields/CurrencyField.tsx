import * as React from 'react';
import { ReactNode } from 'react';
import Input from '@material-ui/core/Input/Input';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { FormProps, ValidatedFormGroupWithLabel } from './common';

const factor = 100;

export default class CurrencyField extends React.Component<FormProps & { children: ReactNode }> {
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
          endAdornment={<InputAdornment position={'end'}>CHF</InputAdornment>}
        />
      </ValidatedFormGroupWithLabel>
    );
  };
}
