// https://material-ui.com/demos/autocomplete/#react-select
// tslint:disable:no-any ; This is adapted from the above example and should work as is; however, we should probably add types some time.

import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { Theme, withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import createStyles from '@material-ui/core/styles/createStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React from 'react';
import Select, {Creatable} from 'react-select';
import {ActionMeta} from 'react-select/lib/types';
import { CancelIcon } from '../../layout/icons';
import { DimeCustomFieldProps, DimeFormControl } from './common';

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
      margin: `${theme.spacing(1 / 2)} ${theme.spacing(1 / 4)}`,
      maxWidth: '170px',
    },
    label: {
      overflow: 'hidden',
      display: 'block',
      textOverflow: 'ellipsis',
    },
    chipFocused: {
      backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
    },
    noOptionsMessage: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
    singleValue: {
      position: 'absolute',
      whiteSpace: 'nowrap',
      fontSize: 16,
      maxWidth: 'calc(100% - 60px)',
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
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
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
      title={props.children}
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      classes={{
        label: props.selectProps.classes.label,
      }}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props: any) {
  return (
    <Paper elevation={2} square className={props.selectProps.classes.paper} {...props.innerProps}>
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

class IntegrationReactSelect extends React.Component<any> {
  select: any;

  state = {
    createdOptions: [],
  };

  constructor(props: any) {
    super(props);
    this.select = React.createRef();
  }

  get value() {
    if (this.props.isMulti) {
      return this.options.filter((e: any) => this.props.value && this.props.value.includes(e.value));
    } else {
      return this.options.find((e: any) => e.value === this.props.value) || '';
    }
  }

  handleChange = (selected: any, action: ActionMeta) => {
    if (action.action === 'clear') {
      if (this.select != null && this.select.current != null) {
        this.select.current.blur();
      }
      this.props.onChange(null);
    } else if (action.action === 'create-option') {
      this.props.onCreate(this.props.isMulti ? selected.filter((e: any) => e.__isNew__) : selected);
      const value = this.props.isMulti ? selected.map((item: any) => item.value) : selected.value;
      this.props.onChange(selected ? value : null);
    } else {
      const value = this.props.isMulti ? selected.map((item: any) => item.value) : selected.value;
      this.props.onChange(selected ? value : null);
    }
  }

  handleFocus = (element: any) => {
    if (this.value) {
      this.select.current.state.inputValue = this.value.label;
    }
  }

  handleBlur = () => {
    const { inputValue } = this.select.current.state;

    if (inputValue !== '' && this.state.createdOptions.findIndex((l: any) => l.value === inputValue) < 0) {
      this.setState({createdOptions: [...this.state.createdOptions, {label: inputValue, value: inputValue}]});
    }
    this.props.onChange(inputValue);
  }

  get options() {
    if (this.state.createdOptions.length > 0) {
      const loadedOptions = this.props.options;
      const filteredCreated = this.state.createdOptions.filter((e: any) => {
        return loadedOptions.findIndex((l: any) => l.value === e.value) < 0;
      });
      return loadedOptions.concat(filteredCreated);
    } else {
      return this.props.options;
    }
  }

  handleMenuClose = () => {
    this.select.current.blur();
  }

  render() {
    // tslint:disable-next-line:max-line-length
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
        'color': theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      menuPortal: (base: any) => ({ ...base, zIndex: 9001 }),
    };

    return (
      <DimeFormControl label={''} margin={margin} fullWidth={fullWidth} errorMessage={errorMessage}>
        {this.props.creatable && !this.props.isMulti && (
          <Creatable
            ref={this.select}
            menuPortalTarget={document.body}
            menuPlacement={'auto'}
            menuPosition={'absolute'}
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
            options={this.options}
            value={this.value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMenuClose={this.handleMenuClose}
            fullWidth={fullWidth}
          />
        )}
        {!this.props.creatable && (
          <Select
            maxMenuHeight={this.props.maxMenuHeight || 250}
            menuPortalTarget={document.body}
            menuPlacement={'auto'}
            menuPosition={'absolute'}
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
        )}
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
