// https://material-ui.com/demos/autocomplete/#react-select

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
import DimeTheme from '../../layout/DimeTheme';
import { ValidatedFormGroupWithLabel } from './common';
import { CancelIcon } from '../../layout/icons';

/*  TODO: If you want to use the MenuPlacement in combination with the Portal, the Menu "is stuck" in the FormControl div
    TODO: Neither the portal nor the overflowX solution are working for the Subforms (e.g. Services in OfferForm)
          The portal causes to scroll with the whole page because it is somehow attached to the current viewport
          The overflow solution does lock the width of X, but the subform tables should be scrollable horizontally
 */

const styles = (theme: Theme) => ({
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
      fullWidth
      margin={props.selectProps.margin}
      error={props.selectProps.error}
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

class IntegrationReactSelect extends React.Component<any> {
  public get value() {
    if (this.props.isMulti) {
      return this.props.options.filter((e: any) => this.props.field.value.includes(e.value));
    } else {
      return this.props.options.find((e: any) => e.value === this.props.field.value) || '';
    }
  }

  public handleChange = (selected: any) => {
    const value = this.props.isMulti ? selected.map((item: any) => item.value) : selected.value;
    this.props.form.setFieldValue(this.props.field.name, selected ? value : null);
  };

  render() {
    const { classes, theme, field, form, label, margin, required, disabled, placeholder = 'Bitte auswählen...', ...rest } = this
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

    const hasErrors: boolean = !!form.errors[field.name] && !!form.touched[field.name];

    return (
      <ValidatedFormGroupWithLabel label={''} field={field} form={form} margin={margin} fullWidth>
        <Select
          menuPortalTarget={this.props.portal ? document.body : undefined}
          menuPlacement={this.props.portal ? 'auto' : undefined}
          menuPosition={this.props.portal ? 'absolute' : 'fixed'}
          classes={classes}
          styles={selectStyles}
          components={components}
          value={this.value}
          onChange={this.handleChange}
          textFieldProps={myLabel}
          isDisabled={disabled}
          error={hasErrors}
          margin={margin}
          placeholder={placeholder}
          {...rest}
        />
      </ValidatedFormGroupWithLabel>
    );
  }
}

export default withStyles(styles(DimeTheme) as any, { withTheme: true })(IntegrationReactSelect);

/*
 *  This makes our selectors usable without a Formik field, in the rare cases that a selector is needed without being tied to a Formik.
 *  It would probably make more sense if the selectors were usable without formik by default and then wrapepd to be formik compatible.
 *  Use it like this:
 *
 *        <ServiceSelector
 *          {...formikCompatible({
 *            label: 'Service',
 *            value: this.state.serviceId,
 *            onChange: service_id => this.setState({service_id})
 *          })}
 *        />
 */
export const formikFieldCompatible = ({ label, value, onChange }: { label: string; value: any; onChange: (value: any) => void }): any => ({
  label,
  field: {
    name: label + '_compat',
    value,
  },
  form: {
    values: [],
    errors: [],
    setFieldValue: (_: any, v: any) => onChange(v),
  },
});
