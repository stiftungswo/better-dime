import MuiFormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import {Warning} from '@material-ui/icons';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { RateGroupSelect } from '../../form/entitySelect/RateGroupSelect';
import { SwitchField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { FormView, FormViewProps } from '../../form/FormView';
import { ActionButton } from '../../layout/ActionButton';
import { DimePaper } from '../../layout/DimePaper';
import { AddIcon, InvoiceIcon, StatisticsIcon } from '../../layout/icons';
import PrintButton from '../../layout/PrintButton';
import { CostgroupStore } from '../../stores/costgroupStore';
import { CustomerStore } from '../../stores/customerStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { MainStore } from '../../stores/mainStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Invoice, Project } from '../../types';
import compose from '../../utilities/compose';
import Effect, { OnChange } from '../../utilities/Effect';
import { empty } from '../../utilities/helpers';
import { isAfterArchivedUnitsCutoff } from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import PositionSubformInline from '../PositionSubformInline';
import { ProjectCategorySubform } from './ProjectCategorySubform';
import { ProjectCostgroupSubform } from './ProjectCostgroupSubform';
import Navigator from './ProjectNavigator';
import ProjectPositionRenderer from './ProjectPositionRenderer';
import { projectSchema } from './projectSchema';
import { ProjectStatTable } from './ProjectStatTable';

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
  intl?: IntlShape;
} & RouteComponentProps &
  FormViewProps<Project>;

@compose(
  injectIntl,
  inject(
    'costgroupStore',
    'customerStore',
    'employeeStore',
    'mainStore',
    'projectCategoryStore',
    'projectStore',
    'rateGroupStore',
    'rateUnitStore',
    'serviceStore',
  ),
  observer,
)
class ProjectForm extends React.Component<Props> {

  state = {
    loading: true,
  };
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
  }

  componentWillMount() {
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

  render() {
    const { project, mainStore, projectStore, intl } = this.props;
    let afterUnitInvalidation = false;

    if (!(empty(project) || this.props.loading || this.state.loading)) {
      afterUnitInvalidation = isAfterArchivedUnitsCutoff(project.created_at);
    }
    const intlText = wrapIntl(this.props.intl!, 'view.project.form');

    return (
      <FormView
        intl={intl!}
        paper={false}
        loading={empty(project) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={projectSchema}
        initialValues={project}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={
          project && project.id ? (dirty: boolean) => (
            <>
              <PrintButton
                hasCitySelection
                path={`projects/${project.id}/effort_report`}
                color={'inherit'}
                title={intlText('print_effort_report')}
                icon={StatisticsIcon}
              />
              <ActionButton
                action={() => projectStore!.createInvoice(project.id!).then((i: Invoice) => this.props.history.push(`/invoices/${i.id}`))}
                color={'inherit'}
                icon={InvoiceIcon}
                secondaryIcon={AddIcon}
                title={intlText('generate_invoice')}
              />
            </>
          ) : (
            undefined
          )
        }
        render={(props: FormikProps<Project>) => {
            return (
              <form onSubmit={props.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={10}>
                    {project.id && <Navigator project={project} />}
                    <DimePaper>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                          <DimeField delayed required component={TextField} name={'name'} label={intlText('general.name', true)} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                          <DimeField required component={EmployeeSelect} name={'accountant_id'} label={intlText('accountant')} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                          <Effect onChange={this.handleCustomerChange} />
                          <DimeField required component={CustomerSelect} name={'customer_id'} label={intlText('general.customer', true)} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                          <DimeField
                            required
                            component={AddressSelect}
                            customerId={props.values.customer_id}
                            name={'address_id'}
                            label={intlText('address')}
                          />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                          <DimeField required component={RateGroupSelect} name={'rate_group_id'} label={intlText('rate')} />
                        </Grid>
                        <Grid item xs={12}>
                          <DimeField
                            delayed
                            required
                            component={TextField}
                            multiline
                            maxRows={14}
                            name={'description'}
                            label={intlText('description')}
                          />
                        </Grid>
                        <Grid item xs={12} lg={8}>
                          <DimeDatePickerField component={DatePicker} name={'deadline'} label={intlText('deadline')} />
                        </Grid>
                        <Grid item xs={12} lg={8}>
                          <DimeField delayed component={CurrencyField} name={'fixed_price'} label={intlText('fixed_price')} />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <span style={{marginLeft: '10px'}}/>
                          <DimeField component={SwitchField} name={'archived'} label={intlText('general.action.archive', true)} />
                          <span style={{marginLeft: '20px'}}/>
                          <DimeField component={SwitchField} name={'chargeable'} label={intlText('chargeable')} />
                        </Grid>
                      </Grid>
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={5}>
                        <DimePaper>
                          <ProjectCostgroupSubform formikProps={props} name={'costgroup_distributions'} />
                        </DimePaper>
                      </Grid>
                      <Grid item xs={12} lg={5}>
                        <DimePaper>
                          <ProjectCategorySubform formikProps={props} name={'category_distributions'} />
                        </DimePaper>
                      </Grid>

                      {project.id && (
                        <Grid item xs={12} lg={10}>
                          <ProjectStatTable
                            moneyBudget={props.values.budget_price}
                            moneyUsed={props.values.current_price}
                            timeBudget={props.values.budget_time}
                            timeUsed={props.values.current_time}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    {props.status! && props.status!.archived_units && afterUnitInvalidation && (
                      <>
                        <Grid container direction="row" alignItems="center" style={{marginLeft: '10px', paddingBottom: '5px'}}>
                          <Grid item>
                            <Warning color={'error'}/>
                          </Grid>
                          <Grid item style={{color: 'red', marginLeft: '5px'}}>
                            <FormattedMessage id="view.project.form.archived_rate_units_warning" />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <DimePaper>
                      <PositionSubformInline tag={ProjectPositionRenderer} formikProps={props} name={'positions'} />
                    </DimePaper>
                  </Grid>
                </Grid>
              </form>
            );
          }
        }
      />
    );
  }
}

export default withRouter(ProjectForm);
