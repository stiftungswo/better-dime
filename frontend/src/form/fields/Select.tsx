import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import DimeTheme from '../../layout/DimeTheme';
import { ValidatedFormGroupWithLabel } from './common';

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
      margin={props.margin}
      fullWidth
      InputProps={{
        inputComponent,
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
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
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
    return this.props.options.find((e: any) => e.value === this.props.field.value);
  }

  public handleChange = (selected: any) => {
    this.props.form.setFieldValue(this.props.field.name, selected.value);
  };

  render() {
    const { classes, theme, field, label, margin, required, disabled, ...rest } = this.props as any;

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
      <ValidatedFormGroupWithLabel label={''} field={this.props.field} form={this.props.form} margin={margin} fullWidth>
        <Select
          menuPortalTarget={document.body}
          classes={classes}
          styles={selectStyles}
          components={components}
          value={this.value}
          onChange={this.handleChange}
          textFieldProps={myLabel}
          isDisabled={disabled}
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
    setFieldValue: (_: any, value: any) => onChange(value),
  },
});
