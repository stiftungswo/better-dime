import * as React from 'react';
import { DimeCustomFieldProps, DimeInputField } from './common';

export type TransformingFieldProps<T> = DimeCustomFieldProps<T | null>;

interface Props<T> extends TransformingFieldProps<T> {
  toValue: (s: string) => T;
  toString: ((value: T) => string) | any; // FIXME weird type bug
}

export class TransformingField<T> extends React.Component<Props<T>> {

  get format() {
    return this.props.value === null || this.props.value === undefined ? '' : this.props.toString(this.props.value);
  }

  state = {
    focused: Boolean(false),
    representation: '',
  };
  constructor(props: Props<T>) {
    super(props);
    this.state.representation = this.format;
  }

  handleBlur = () => {
    this.setState({focused: false});
  }

  handleFocus = () => {
    this.setState({focused: true});

    if (this.props.value) {
      const stringVal = this.props.toString(this.props.value);
      this.setState({ representation: stringVal });
      this.props.onChange(this.props.toValue(stringVal));
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const representation = e.target.value;

    if (e.type === 'blur') {
      this.handleBlur();
    }
    this.setState({ representation });
    if (representation === '') {
      this.props.onChange(null);
    } else {
      this.props.onChange(this.props.toValue(representation));
    }
  }

  get value() {
    if (this.state.focused) {
      return this.state.representation;
    } else {
      return this.format;
    }
  }

  render = () => {
    const { toValue, toString, ...rest } = this.props;
    return <DimeInputField {...rest} value={this.value} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} />;
  }
}
