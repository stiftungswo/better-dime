import * as React from 'react';
import { InputFieldProps, InputFieldWithValidation } from './common';

interface Props<T> extends InputFieldProps {
  toValue: (s: string) => T;
  toString: (value: T) => string;
}

export class TransformingField<T> extends React.Component<Props<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state.representation = this.format;
  }

  public state = {
    representation: '',
  };

  public get format() {
    return this.props.field.value ? this.props.toString(this.props.field.value) : '';
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const representation = e.target.value;
    this.setState({ representation });
    if (representation === '') {
      this.props.form.setFieldValue(this.props.field.name, null);
    } else {
      this.props.form.setFieldValue(this.props.field.name, this.props.toValue(representation));
    }
  };

  public render = () => {
    const { toValue, toString, ...rest } = this.props;
    return <InputFieldWithValidation {...rest} value={this.state.representation} onChange={this.handleChange} />;
  };
}
