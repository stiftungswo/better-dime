// https://material-ui.com/demos/autocomplete/#react-select
// tslint:disable:no-any ; This is adapted from the above example and should work as is; however, we should probably add types some time.

import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { DimeCustomFieldProps, DimeFormControl } from './common';
import { CancelIcon } from '../../layout/icons';
import createStyles from '@material-ui/core/styles/createStyles';
import { ActionMeta, ActionTypes } from 'react-select/lib/types';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
    },
    chip: {
      margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
      backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
    },
    noOptionsMessage: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
      position: 'absolute',
      whiteSpace: 'nowrap',
      fontSize: 16,
      maxWidth: 'calc(100% - 40px)',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    disabled: {
      color: theme.palette.text.disabled,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
  });

function NoOptionsMessage(props: any) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }: any) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: any) {
  return (
    <TextField
      margin={props.selectProps.margin}
      error={props.selectProps.error}
      fullWidth={props.selectProps.fullWidth}
      InputProps={{
        inputComponent,
        disabled: props.isDisabled,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props: any) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        whiteSpace: 'unset',
        height: 'auto',
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props: any) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props: any) {
  const classes = props.selectProps.classes;
  return (
    <Typography className={classNames(classes.singleValue, { [classes.disabled]: props.isDisabled })} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: any) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: any) {
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
  public get value() {
    if (this.props.isMulti) {
      return this.props.options.filter((e: any) => this.props.value.includes(e.value));
    } else {
      return this.props.options.find((e: any) => e.value === this.props.value) || '';
    }
  }

  public handleChange = (selected: any, action: ActionMeta) => {
    if (action.action === 'clear') {
      this.props.onChange(null);
    } else {
      const value = this.props.isMulti ? selected.map((item: any) => item.value) : selected.value;
      this.props.onChange(selected ? value : null);
    }
  };

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
      input: (base: any) => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      menuPortal: (base: any) => ({ ...base, zIndex: 9001 }),
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
