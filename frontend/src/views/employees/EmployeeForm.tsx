import Grid from '@mui/material/Grid';
import {Warning} from '@mui/icons-material';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { EmployeeGroupSelect } from '../../form/entitySelect/EmployeeGroupSelect';
import { EmailField, NumberField, PasswordField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import Select from '../../form/fields/Select';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { EmployeeGroupStore } from '../../stores/employeeGroupStore';
import {Employee, WorkPeriod} from '../../types';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import AddressesSubformInline from '../persons/AddressesSubformInline';
import { WorkPeriodSubform } from './WorkPeriodSubform';

export interface Props extends FormViewProps<Employee> {
  employee: Employee | undefined;
  schema: object;
  employeeGroupStore?: EmployeeGroupStore;
  intl?: IntlShape;
}
@compose(
  injectIntl,
  inject('employeeGroupStore'),
  observer,
)
export default class EmployeeForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.props.employeeGroupStore!.fetchAll()
      .then(() => this.setState({ loading: false }));
  }

  getLocaleOptions() {
    return [
      {value: 'de', label: 'Deutsch'},
      {value: 'fr', label: 'Français'},
    ];
  }

  render() {
    const { employee, schema, intl } = this.props;
    const intlText = wrapIntl(intl!, 'view.employee');
    let hasOverlaps = false;

    if (employee !== undefined) {
      const workPeriods = employee.work_periods;

      for (const wp of workPeriods) {
        if (wp.overlapping_periods) {
          hasOverlaps = true;
        }
      }
    }

    return (
      <FormView
        intl={intl!}
        title={this.props.title}
        validationSchema={schema}
        loading={empty(employee) || this.props.loading || this.state.loading}
        initialValues={{ ...employee, password: '', password_repeat: '' }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        paper={false}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={10}>
                  <DimePaper>
                    <FormHeader> <FormattedMessage id="view.employee.general_info" /> </FormHeader>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={TextField} name={'first_name'} label={intlText('first_name')} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField component={TextField} name={'last_name'} label={intlText('last_name')} />
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={12} sm={6} style={{paddingRight: '8px'}}>
                        <DimeField component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6} style={{paddingLeft: '8px'}}>
                        <DimeField component={EmployeeGroupSelect} name={'employee_group_id'} label={intlText('group')} />
                      </Grid>
                    </Grid>

                    <Grid container={true} spacing={2}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={PasswordField} name={'password'} label={intlText('new_password')} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={PasswordField} name={'password_repeat'} label={intlText('new_password_again')} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>

                <Grid item xs={10}>
                  <AddressesSubformInline formikProps={props} name={'addresses'}/>
                </Grid>

                <Grid item xs={12}>
                  {hasOverlaps && (
                    <>
                      <Grid container direction="row" alignItems="center" style={{marginLeft: '10px', paddingBottom: '5px'}}>
                        <Grid item>
                          <Warning color={'error'}/>
                        </Grid>
                        <Grid item style={{color: 'red', marginLeft: '5px'}}>
                          Arbeitsperioden mit überlappenden Zeiträumen vorhanden! Überträge konnen folglich inkorrekt sein.
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <DimePaper>
                    <WorkPeriodSubform
                      formikProps={props}
                      name={'work_periods'}
                      yearly_vacation_budget={employee ? employee.holidays_per_year : null}
                    />
                  </DimePaper>
                </Grid>

                <Grid item xs={10}>
                  <DimePaper>
                    <FormHeader> <FormattedMessage id="view.employee.user_settings" /> </FormHeader>

                    <Grid container={true} spacing={2}>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={NumberField} name={'holidays_per_year'} label={intlText('holidays_per_year')} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12} sm={6}>
                        <DimeField component={Select} name={'locale'} label={intlText('locale')} fullWidth={true} options={this.getLocaleOptions()} />
                      </Grid>
                    </Grid>

                    <Grid container={true} spacing={1}>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'can_login'} label={intlText('can_login')} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'archived'} label={intlText('is_archived')} fullWidth={true} />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <DimeField component={SwitchField} name={'is_admin'} label={intlText('is_admin')} fullWidth={true} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        )}
      />
    );
  }
}
