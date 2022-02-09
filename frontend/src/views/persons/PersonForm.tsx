import Grid from '@material-ui/core/Grid';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RateGroupSelect } from 'src/form/entitySelect/RateGroupSelect';
import { CompanySelect } from '../../form/entitySelect/CompanySelect';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { EmailField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { CompanyStore } from '../../stores/companyStore';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { Person } from '../../types';
import compose from '../../utilities/compose';
import Effect, { OnChange } from '../../utilities/Effect';
import { empty } from '../../utilities/helpers';
import AddressesSubformInline from './AddressesSubformInline';
import { personSchema } from './personSchema';
import PhoneNumberSubformInline from './PhoneNumbersSubformInline';

export interface Props extends FormViewProps<Person> {
  companyStore?: CompanyStore;
  customerTagStore?: CustomerTagStore;
  person?: Person;
  rateGroupStore?: RateGroupStore;
  employeeStore?: EmployeeStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('companyStore', 'customerTagStore', 'employeeStore', 'rateGroupStore'),
  observer,
)
export default class PersonForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentWillMount() {
    const person = this.props.person;
    const loadCompany = new Promise(res => {
      if (person && person.company_id) {
        this.props.companyStore!.fetchOne(person.company_id).then(() => res());
      } else {
        this.props.companyStore!.entity = undefined;
        res();
      }
    });
    Promise.all([
      this.props.companyStore!.fetchAll(),
      this.props.customerTagStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
      loadCompany,
    ]).then(() => this.setState({ loading: false }));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const person = this.props.person;
    if (person && person.company_id && (!prevProps.person || person.company_id !== prevProps.person.company_id)) {
      this.props.companyStore!.fetchOne(person!.company_id!);
    }
  }

  handleCompanyChange: OnChange<Person> = (current, next, formik) => {
    if (current.values.company_id !== next.values.company_id) {
      if (next.values.company_id !== null) {
        this.props.companyStore!.fetchOne(next.values.company_id);
      } else {
        this.props.companyStore!.company = undefined;
      }
    }
  }

  render() {
    const { person, intl } = this.props;
    const { company } = this.props.companyStore!;
    const inheritedAddresses = company ? company.addresses : [];
    const inheritedPhoneNumbers = company ? company.phone_numbers : [];

    return (
      <FormView
        intl={intl!}
        paper={false}
        title={this.props.title}
        validationSchema={personSchema}
        loading={empty(person) || this.props.loading || this.state.loading}
        initialValues={{ ...person }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Person>) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DimePaper>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={TextField} name={'salutation'} label={'Anrede'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={TextField} name={'first_name'} label={'Vorname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={TextField} name={'last_name'} label={'Nachname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Effect onChange={this.handleCompanyChange} />
                        <DimeField delayed component={CompanySelect} name={'company_id'} label={'Firma'} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <DimeField delayed component={TextField} name={'department'} label={'Abteilung'} />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <div style={{marginTop: '1.5em'}}>
                          <DimeField delayed component={SwitchField} name={'department_in_address'} label={'Adressrelevant?'} />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed multiline component={TextField} name={'comment'} label={'Bemerkungen (Intern)'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={RateGroupSelect} name={'rate_group_id'} label={'Tarif'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Grid item xs={12}>
                          <DimeField delayed component={SwitchField} name={'hidden'} label={'Kontakt versteckt?'} />
                        </Grid>
                        <Grid item xs={12}>
                          <DimeField delayed component={SwitchField} name={'archived'} label={'Archiviert?'} />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField isMulti delayed component={CustomerTagSelect} name={'tags'} label={'Tags'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={EmployeeSelect} name={'accountant_id'} label={'Verantwortlicher Mitarbeiter'} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
                <Grid item xs={12}>
                  <AddressesSubformInline formikProps={props} name={'addresses'} inherited={inheritedAddresses} hideable />
                </Grid>
                <Grid item xs={12}>
                  <PhoneNumberSubformInline formikProps={props} name={'phone_numbers'} inherited={inheritedPhoneNumbers} />
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        )}
      />
    );
  }
}
