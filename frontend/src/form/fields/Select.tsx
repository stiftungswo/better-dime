// https://material-ui.com/demos/autocomplete/#react-select
// tslint:disable:no-any ; This is adapted from the above example and should work as is; however, we should probably add types some time.

import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import Select from 'react-select';
import { ValueContainerProps } from 'react-select/src/components/containers';
import { ControlProps } from 'react-select/src/components/Control';
import { NoticeProps } from 'react-select/src/components/Menu';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import { PlaceholderProps } from 'react-select/src/components/Placeholder';
import { SingleValueProps } from 'react-select/src/components/SingleValue';
import { ActionMeta, InputActionMeta } from 'react-select/src/types';
import { CancelIcon } from '../../layout/icons';
import { DimeCustomFieldProps, DimeFormControl } from './common';

export interface OptionType {
  label: string;
  value: string;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 250,
      minWidth: 290,
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  });

function NoOptionsMessage(props: NoticeProps<OptionType>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & HTMLAttributes<HTMLDivElement>;
function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

function Option(props: any) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

type MuiPlaceholderProps = Omit<PlaceholderProps<OptionType>, 'innerProps'> &
  Partial<Pick<PlaceholderProps<OptionType>, 'innerProps'>>;
function Placeholder(props: MuiPlaceholderProps) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
      {children}
    </Typography>
  );
}

function SingleValue(props: SingleValueProps<OptionType>) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: ValueContainerProps<OptionType>) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: MultiValueProps<OptionType>) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props: any) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

/*
 * If the select is cut off by its container, set the `portal` prop to true.
 *
 * NOTE: If you want to use `menuPlacement` in combination with `portal`, the Menu "is stuck" in the FormControl div.
 *    neither the portal nor the overflowX solution are working for the Subforms (e.g. Services in OfferForm)
 *    The portal causes to scroll with the whole page because it is somehow attached to the current viewport
 *    The overflow solution does lock the width of X, but the subform tables should be scrollable horizontally
 */
class IntegrationReactSelect extends React.Component<any> {
  get value() {
    if (this.props.isMulti) {
      return this.props.options.filter((e: any) => this.props.value && this.props.value.includes(e.value));
    } else {
      return this.props.options.find((e: any) => e.value === this.props.value) || '';
    }
  }

  handleChange = (selected: any, action: any) => {
    /* tslint:disable */
    console.log(selected)
    console.log(action);
    if (selected === null) {
      this.props.onChange(null)
    } else {
      const value = this.props.isMulti ? selected.map((item: any) => item.value) : selected.value;
      this.props.onChange(selected ? value : null);
    }
  }

  render() {
    const { classes, theme, margin, required, disabled, placeholder = 'Bitte auswählen...', errorMessage, fullWidth = true, ...rest } = this
      .props as any;

    const myLabel = this.props.label
      ? {
        label: this.props.label,
        InputLabelProps: {
          shrink: true,
          required,
        },
      }
      : undefined;

    const selectStyles = {
      input: (base: CSSProperties) => ({
        ...base,
        'color': theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <DimeFormControl label={''} margin={margin} fullWidth={fullWidth} errorMessage={errorMessage}>
        <Select
          menuPortalTarget={this.props.portal ? document.body : undefined}
          menuPlacement={this.props.portal ? 'auto' : undefined}
          menuPosition={this.props.portal ? 'absolute' : 'fixed'}
          classes={classes}
          styles={selectStyles}
          components={components}
          textFieldProps={myLabel}
          isDisabled={disabled}
          error={Boolean(errorMessage)}
          margin={margin}
          placeholder={placeholder}
          noOptionsMessage={() => 'Keine Optionen verfügbar'}
          {...rest}
          value={this.value}
          onChange={this.handleChange}
          fullWidth={fullWidth}
        />
      </DimeFormControl>
    );
  }
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);

type Single = number | null;
type Multi = number[] | [];

type ValueType<T> = T extends number[] ? Multi : T extends Single ? Single : never;

export interface DimeSelectFieldProps<T> extends DimeCustomFieldProps<ValueType<T>> {
  isMulti?: boolean;
  fullWidth?: boolean;
}
