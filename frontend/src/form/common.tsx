import * as React from 'react';
import { ErrorMessage, FieldProps, Formik, FormikBag, FormikConfig, FormikProps, FormikState } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input/Input';
import { ReactNode } from 'react';
import Switch from '@material-ui/core/Switch/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import SaveIcon from '@material-ui/icons/Save';

export type InputFieldProps = { type: string } & FormProps;
export type FormProps = { label: string; children: JSX.Element; fullWidth: boolean } & FieldProps;

export const ValidatedFormGroupWithLabel = ({ label, field, form: { touched, errors }, children, fullWidth }: FormProps) => {
  const hasErrors: boolean = !!errors[field.name] && !!touched[field.name];

  return (
    <FormControl margin={'normal'} error={hasErrors} fullWidth={fullWidth}>
      <InputLabel htmlFor={field.name}>{label}</InputLabel>
      {children}
      <ErrorMessage name={field.name} render={error => <FormHelperText error={true}>{error}</FormHelperText>} />
    </FormControl>
  );
};

export const FieldWithValidation = ({ label, field, type = 'text', form, fullWidth = false }: FormProps & { type: string }) => {
  return (
    <ValidatedFormGroupWithLabel label={label} field={field} form={form} fullWidth={fullWidth}>
      <input {...field} type={type} />
    </ValidatedFormGroupWithLabel>
  );
};

export const SwitchField = ({ label, field }: FormProps) => (
  <FormControlLabel control={<Switch checked={field.value} {...field} />} label={label} />
);

export const InputFieldWithValidation = ({ label, field, form, fullWidth = false, type = 'text' }: InputFieldProps) => (
  <ValidatedFormGroupWithLabel label={label} field={field} form={form} fullWidth={fullWidth}>
    <Input id={field.name} name={field.name} type={type} fullWidth={fullWidth} {...field} />
  </ValidatedFormGroupWithLabel>
);

export const EmailFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'email'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

export const NumberFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'number'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

export const PasswordFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'password'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

export const TextFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'text'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

interface EditFormProps<T> {
  header: string;
  onSubmit: (values: any) => Promise<any>;
  render: (props: FormikProps<T>) => React.ReactNode;
}

export class EditForm<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & EditFormProps<Values>,
  FormikState<Values>
> {
  private submit = async (values: any, formikBag: FormikBag<any, any>) => {
    await this.props.onSubmit(values);
    formikBag.setSubmitting(false);
  };

  public render() {
    const bla: any = this.props;

    return (
      <Formik
        {...bla}
        onSubmit={this.submit}
        render={props => (
          <div>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={6}>
                <Typography component="h1" variant="h4" align={'left'}>
                  {this.props.header}
                </Typography>
              </Grid>

              <Grid item={true} container={true} xs={12} sm={6} justify={'flex-end'}>
                <Button variant={'contained'} color={'primary'} onClick={() => props.handleSubmit()} disabled={props.isSubmitting}>
                  Speichern
                  <SaveIcon />
                </Button>
              </Grid>
            </Grid>

            <br />

            {this.props.render(props as any)}
          </div>
        )}
      />
    );
  }
}
