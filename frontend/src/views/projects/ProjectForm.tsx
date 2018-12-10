import * as React from 'react';
import { Field, FormikProps } from 'formik';
import { SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Project } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import MuiTextField from '@material-ui/core/TextField';
import MuiFormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { ProjectCategorySelector } from '../../form/entitySelector/ProjectCategorySelector';
import ProjectPositionSubformInline from './ProjectPositionSubformInline';
import { ProjectStore } from '../../stores/projectStore';
import Navigator from './ProjectNavigator';
import { projectSchema } from './projectSchema';
import Effect, { OnChange } from '../../utilities/Effect';
import { CustomerStore } from '../../stores/customerStore';
import { CustomerSelector } from '../../form/entitySelector/CustomerSelector';
import { DimePaper } from '../../layout/DimePaper';

interface InfoFieldProps {
  value: string;
  label: string;
  unit?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const InfoField = ({ value, label, unit, error, fullWidth = true }: InfoFieldProps) => (
  <MuiFormControl margin={'normal'} error={error} fullWidth={fullWidth}>
    <MuiTextField
      disabled
      variant={'outlined'}
      value={value}
      label={label}
      InputProps={{
        endAdornment: unit ? <InputAdornment position={'end'}>{unit}</InputAdornment> : undefined,
      }}
      InputLabelProps={{
        shrink: true,
        error,
      }}
    />
  </MuiFormControl>
);

export interface Props extends FormViewProps<Project> {
  mainStore?: MainStore;
  projectStore?: ProjectStore;
  customerStore?: CustomerStore;
  project: Project;
}

@compose(
  inject('mainStore', 'projectStore', 'customerStore'),
  observer
)
export default class ProjectForm extends React.Component<Props> {
  // set rateGroup based on selected customer.
  handleCustomerChange: OnChange<Project> = (current, next, formik) => {
    if (current.values.customer_id !== next.values.customer_id) {
      if (!current.values.customer_id && !current.values.rate_group_id) {
        const customer = this.props.customerStore!.customers.find(a => a.id === next.values.customer_id);
        if (customer) {
          formik.setFieldValue('rate_group_id', customer.rate_group_id);
        }
      }
    }
  };

  public render() {
    const { project, mainStore, projectStore } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(project) || this.props.loading}
        title={this.props.title}
        validationSchema={projectSchema}
        initialValues={project}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Project>) => (
          <form onSubmit={props.handleSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={12} lg={8}>
                {project.id && <Navigator project={project} projectStore={projectStore!} />}
                <DimePaper>
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
                      <Field delayed fullWidth required component={TextField} name={'name'} label={'Name'} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Effect onChange={this.handleCustomerChange} />
                      <Field fullWidth required component={CustomerSelector} name={'customer_id'} label={'Kunde'} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Field
                        fullWidth
                        required
                        component={AddressSelector}
                        customerId={props.values.customer_id}
                        name={'address_id'}
                        label={'Adresse'}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Field fullWidth required component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                      <Field
                        fullWidth
                        required
                        component={EmployeeSelector}
                        name={'accountant_id'}
                        label={'Verantwortlicher Mitarbeiter'}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Field fullWidth required component={ProjectCategorySelector} name={'category_id'} label={'Tätigkeitsbereich'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        delayed
                        fullWidth
                        required
                        component={TextField}
                        multiline
                        rowsMax={14}
                        name={'description'}
                        label={'Beschreibung'}
                      />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Field fullWidth component={DatePicker} name={'deadline'} label={'Deadline'} />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Field delayed fullWidth component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field component={SwitchField} name={'chargeable'} label={'Verrechenbar'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field component={SwitchField} name={'archived'} label={'Archiviert'} />
                    </Grid>
                    {project.id && project.offer_id && (
                      <>
                        {/*TODO this design is not so great. Maybe just use a table like Breakdown and be a bit more consistent?*/}
                        <Grid item xs={12} lg={6}>
                          <InfoField
                            fullWidth
                            label={'Verbleibendes Budget'}
                            value={`${mainStore!.formatCurrency(project.current_price, false)} / ${mainStore!.formatCurrency(
                              project.budget_price,
                              false
                            )}`}
                            error={project.current_price > project.budget_price}
                            unit={'CHF'}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <InfoField
                            fullWidth
                            label={'Verbleibende Zeit'}
                            value={`${mainStore!.formatDuration(project.current_time, 'h', false)} / ${mainStore!.formatDuration(
                              project.budget_time,
                              'h',
                              false
                            )}`}
                            error={project.current_time > project.budget_time}
                            unit={'h'}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </DimePaper>
              </Grid>

              <Grid item xs={12}>
                <DimePaper>
                  <ProjectPositionSubformInline formikProps={props} name={'positions'} />
                </DimePaper>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}
