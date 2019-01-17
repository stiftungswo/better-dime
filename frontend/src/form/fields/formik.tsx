import React from 'react';
import { Field, FieldProps, getIn } from 'formik';
import Input, { InputProps } from '@material-ui/core/Input/Input';
import { DimeFormControlProps, DimeInputFieldProps } from './common';

/**
 * This component tries to improve Formik performance by delaying the onChange call until the input field is blurred.
 * Formik's <FastField> is supposed to do this already, but it seemed to be syncing onChange anyway. This _might_ introduce some issues
 * like the value of the last input of the form not being synced back into formik on hitting enter to submit the form.
 */
export class DelayedInput extends React.Component<InputProps, { value?: string }> {
  public constructor(props: InputProps) {
    super(props);
    this.state = {
      value: String(props.value),
    };
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ value: e.target.value });

  public handleBlur: any = this.props.onChange; //tslint:disable-line:no-any

  public render = () => {
    return <Input {...this.props} value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} />;
  };
}

const wireFormik = ({ delayed = false } = {}) => (Component: React.ComponentType<DimeFormControlProps & DimeInputFieldProps>) => ({
  form,
  field,
  ...rest
}: DimeFormControlProps & FieldProps) => {
  const touched = getIn(form.touched, field.name);
  const error = getIn(form.errors, field.name);
  //tslint:disable-next-line:no-any
  const handleChange = (x: any) => {
    if (x === null) {
      form.setFieldValue(field.name, null);
    } else if (x.target && x.target.type === 'checkbox') {
      form.setFieldValue(field.name, x.target.checked);
    } else if (x.target) {
      form.setFieldValue(field.name, x.target.value);
    } else {
      form.setFieldValue(field.name, x);
    }
  };
  return (
    <Component
      InputComponent={delayed ? DelayedInput : Input}
      errorMessage={touched && error}
      {...field}
      onChange={handleChange}
      {...rest}
    />
  );
};

type DimeFieldProps = any; //tslint:disable-line:no-any ; formik field does this, so we do too

export class DimeField extends React.Component<DimeFieldProps, { component: React.ReactType }> {
  componentWillMount() {
    this.setState({
      component: wireFormik({ delayed: this.props.delayed })(this.props.component),
    });
  }

  componentDidUpdate(prevProps: Readonly<DimeFieldProps>) {
    if (prevProps.component !== this.props.component) {
      this.setState({
        component: wireFormik({ delayed: this.props.delayed })(this.props.component),
      });
    }
  }

  render() {
    const { component, delayed, ...rest } = this.props;
    return <Field component={this.state.component} {...rest} />;
  }
}
