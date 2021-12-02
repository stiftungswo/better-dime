// tslint:disable:max-classes-per-file
import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { DimeCustomFieldProps, DimeInputField } from './common';

// for number fields: disable the +1/-1 buttons,
// as they are rather silly for vats like 7.7
// source: https://stackoverflow.com/questions/50823182/material-ui-remove-up-down-arrow-dials-from-textview
const style = {
  noUpDown: { /* Firefox */
      '& input[type=number]': {
      '-moz-appearance': 'textfield',
    }, /* Chrome, Safari, Edge, Opera */
      '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      'margin': 0,
    },
      '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      'margin': 0,
    },
  },
};

export type TransformingFieldProps<T> = DimeCustomFieldProps<T | null>;

interface InnerProps<T> extends TransformingFieldProps<T> {
  toValue: (s: string) => T;
  toString: ((value: T) => string) | any; // FIXME weird type bug
}
// disabling +1/-1 buttonly only makes sense on number fields.
interface GeneralProps<T> extends InnerProps<T> {
  disableUpDown?: false;
}
interface NoUpDownProps extends InnerProps<number> {
  disableUpDown: true;
}
type Props<T> = GeneralProps<T> | NoUpDownProps;

class TransformingFieldInner<T> extends React.Component<InnerProps<T> & {className?: any} > {

  get format() {
    return this.props.value === null || this.props.value === undefined ? '' : this.props.toString(this.props.value);
  }

  state = {
    focused: Boolean(false),
    representation: '',
  };
  constructor(props: InnerProps<T>) {
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
    return (
      <DimeInputField
        {...rest}
        value={this.value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      />
    );
  }
}
// 2021-10-29 This seems like way too much boilerplate.
// Is there an easier way to specialize TransformingField<T> for T=number ?
class TransformingNumberFieldInner extends React.Component<InnerProps<number> & WithStyles<typeof style> > {
  render = () => {
    const { classes, ...rest} = this.props;
    return <TransformingFieldInner className={classes.noUpDown} {...rest} />;
  }
}
const TransformingNumberFieldMiddle = withStyles(style)(TransformingNumberFieldInner);

export class TransformingField<T> extends React.Component<Props<T> > {
  render = () => {
    if (this.props.disableUpDown) {
      const props = this.props as NoUpDownProps;
      const {disableUpDown, ...rest} = props;
      return <TransformingNumberFieldMiddle {...rest} />;
    } else {
      const props = this.props as GeneralProps<T>;
      const {disableUpDown, ...rest} = props;
      return <TransformingFieldInner {...rest} />;
    }
  }
}
