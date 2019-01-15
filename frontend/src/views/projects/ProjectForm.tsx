import * as React from 'react';
import { Field, FormikProps } from 'formik';
import { SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Invoice, Project } from '../../types';
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
import { RateGroupStore } from '../../stores/rateGroupStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { CostgroupStore } from '../../stores/costgroupStore';
import { ProjectCostgroupSubform } from './ProjectCostgroupSubform';
import { ProjectBudgetTable } from './ProjectBudgetTable';
import { ActionButton } from '../../layout/ActionButton';
import { AddIcon, InvoiceIcon, StatisticsIcon } from '../../layout/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import PrintButton from '../../layout/PrintButton';

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

export type Props = {
  costgroupStore?: CostgroupStore;
  customerStore?: CustomerStore;
  employeeStore?: EmployeeStore;
  mainStore?: MainStore;
  project: Project;
  projectCategoryStore?: ProjectCategoryStore;
  projectStore?: ProjectStore;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
} & RouteComponentProps &
  FormViewProps<Project>;

@compose(
  inject(
    'costgroupStore',
    'customerStore',
    'employeeStore',
    'mainStore',
    'projectCategoryStore',
    'projectStore',
    'rateGroupStore',
    'rateUnitStore',
    'serviceStore'
  ),
  observer
)
class ProjectForm extends React.Component<Props> {
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

  public state = {
    loading: true,
  };

  public componentWillMount() {
    Promise.all([
      this.props.costgroupStore!.fetchAll(),
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.projectCategoryStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  public render() {
    const { project, mainStore, projectStore } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(project) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={projectSchema}
        initialValues={project}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={
          project && project.id ? (
            <>
              <PrintButton
                path={`projects/${project.id}/print_effort_report`}
                color={'inherit'}
                title={'Aufwandsrapport drucken'}
                icon={StatisticsIcon}
              />
              <ActionButton
                action={() => projectStore!.createInvoice(project.id!).then((i: Invoice) => this.props.history.push(`/invoices/${i.id}`))}
                color={'inherit'}
                icon={InvoiceIcon}
                secondaryIcon={AddIcon}
                title={'Neue Rechnung aus Projekt generieren'}
              />
            </>
          ) : (
            undefined
          )
        }
        render={(props: FormikProps<Project>) => (
          <form onSubmit={props.handleSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={12} lg={8}>
                {project.id && <Navigator project={project} />}
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
                  </Grid>
                </DimePaper>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={24}>
                  <Grid item xs={12} lg={8}>
                    <DimePaper>
                      <ProjectCostgroupSubform formikProps={props} name={'costgroup_distributions'} />
                    </DimePaper>
                  </Grid>

                  {project.id && project.offer_id && (
                    <Grid item xs={12} lg={4}>
                      <ProjectBudgetTable
                        moneyBudget={props.values.budget_price}
                        moneyUsed={props.values.current_price}
                        timeBudget={props.values.budget_time}
                        timeUsed={props.values.current_time}
                      />
                    </Grid>
                  )}
                </Grid>
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

export default withRouter(ProjectForm);
