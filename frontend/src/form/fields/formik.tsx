import Input, { InputProps } from '@material-ui/core/Input/Input';
import { Field, FieldProps, getIn } from 'formik';
import React from 'react';
import { DimeFormControlProps, DimeInputFieldProps } from './common';

/**
 * This component tries to improve Formik performance by delaying the onChange call until the input field is blurred.
 * Formik's <FastField> is supposed to do this already, but it seemed to be syncing onChange anyway. This _might_ introduce some issues
 * like the value of the last input of the form not being synced back into formik on hitting enter to submit the form.
 */
export class DelayedInput extends React.Component<InputProps, { focused: boolean, value?: string }> {

  constructor(props: InputProps) {
    super(props);
    this.state = {
      focused: Boolean(false),
      value: String(props.value),
    };
  }

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }

    this.setState({focused: false});
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ focused: true, value: e.target.value });
  }

  get value() {
    if (this.state.focused) {
      return this.state.value;
    } else {
      return this.props.value;
    }
  }

  render = () => {
    return <Input {...this.props} value={this.value} onChange={this.handleChange} onBlur={this.handleBlur} />;
  }
}

type onChangeWrappedProps = (value: any) => void;

const wireFormik = ({ delayed = false } = {}) => (Component: React.ComponentType<DimeFormControlProps & DimeInputFieldProps>, onChangeWrapped: onChangeWrappedProps) => ({
  form,
  field,
  // tslint:disable-next-line:trailing-comma
  ...rest
}: DimeFormControlProps & FieldProps) => {
  const touched = getIn(form.touched, field.name);
  const error = getIn(form.errors, field.name);
  // tslint:disable-next-line:no-any
  const handleChange = (x: any) => {
    if (x == null) {
      form.setFieldValue(field.name, null);
    } else if (x.target && x.target.type === 'checkbox') {
      form.setFieldValue(field.name, x.target.checked);
    } else if (x.target) {
      form.setFieldValue(field.name, x.target.value);
    } else {
      form.setFieldValue(field.name, x);
    }
    if (onChangeWrapped) {
      onChangeWrapped(x);
    }
  };
  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  return (
    <Component
      InputComponent={delayed ? DelayedInput : Input}
      errorMessage={touched && error ? error : undefined}
      {...field}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  );
};

interface DimeFieldState {
  component: React.ReactType;
}

type DimeFieldProps = any; // tslint:disable-line:no-any ; formik field does this, so we do too

// tslint:disable
export class DimeField extends React.Component<DimeFieldProps, DimeFieldState> {
  componentWillMount() {
    this.setState({
      component: wireFormik({ delayed: this.props.delayed })(this.props.component, this.props.onChangeWrapped),
    });
  }

  componentDidUpdate(prevProps: Readonly<DimeFieldState>) {
    if (prevProps.component !== this.props.component) {
      this.setState({
        component: wireFormik({ delayed: this.props.delayed })(this.props.component, this.props.onChangeWrapped),
      });
    }
  }

  render() {
    const { component, delayed, onChangeWrapped, ...rest } = this.props;
    return <Field component={this.state.component} {...rest} />;
  }
}
