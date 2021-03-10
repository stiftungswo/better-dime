import Grid from '@material-ui/core/Grid/Grid';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RateGroupSelect } from 'src/form/entitySelect/RateGroupSelect';
import { OverviewTable } from 'src/layout/OverviewTable';
import TableToolbar from 'src/layout/TableToolbar';
import { EmployeeStore } from 'src/stores/employeeStore';
import { MainStore } from 'src/stores/mainStore';
import { Company, Person } from 'src/types';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { EmailField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { PeopleStore } from '../../stores/peopleStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import AddressesSubformInline from '../persons/AddressesSubformInline';
import PhoneNumberSubformInline from '../persons/PhoneNumbersSubformInline';
import { companySchema } from './companySchema';

export interface Props extends FormViewProps<Company> {
  company: Company | undefined;
  customerTagStore?: CustomerTagStore;
  employeeStore?: EmployeeStore;
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  rateGroupStore?: RateGroupStore;
}

const personsColumns = [
  {
    id: 'first_name',
    label: 'Vorname',
  },
  {
    id: 'last_name',
    label: 'Nachname',
  },
  {
    id: 'email',
    label: 'E-Mail',
  },
  {
    id: '_',
    label: 'Strasse',
    format: (p: Person) => {
      return <>{p.addresses ? (p.addresses.length > 0 ? p.addresses[0].street : '') : ''}</>;
    },
  },
];

@compose(
  inject('customerTagStore', 'employeeStore', 'mainStore', 'peopleStore', 'rateGroupStore'),
  observer,
)
export default class CompanyForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  get persons() {
    const { peopleStore } = this.props;
    const persons = this.props.company ? (this.props.company.persons ? this.props.company.persons : []) : [];

    let people: Person[] = [];
    people = peopleStore!.people.filter((p: Person) => persons.includes(p.id));

    return people;
  }

  componentWillMount() {
    Promise.all([
      this.props.customerTagStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.peopleStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
    ]).then(
      () => this.setState({ loading: false }),
    );
  }

  render() {
    const { company, mainStore } = this.props;
    const { loading } = this.state;

    return (
      <FormView
        paper={false}
        title={this.props.title}
        validationSchema={companySchema}
        loading={empty(company) || this.props.loading}
        initialValues={{ ...company }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Company>) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <DimePaper>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={TextField} name={'name'} label={'Name'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={RateGroupSelect} name={'rate_group_id'} label={'Tarif'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed multiline component={TextField} name={'comment'} label={'Bemerkungen'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField delayed component={SwitchField} name={'hidden'} label={'Kontakt versteckt?'} />
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
                  <AddressesSubformInline formikProps={props} name={'addresses'} hideable/>
                </Grid>
                <Grid item xs={12}>
                  <PhoneNumberSubformInline formikProps={props} name={'phone_numbers'} />
                </Grid>
                <Grid item xs={12}>
                  {!loading && (
                    <DimePaper>
                      <TableToolbar title={'Mitarbeiter'} />
                      <OverviewTable
                        data={this.persons}
                        onClickRow={(m: Person) => {
                          mainStore!.navigateTo(`/persons/${m.id}`);
                        }}
                        columns={personsColumns}
                      />
                    </DimePaper>
                  )}
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        )}
      />
    );
  }
}
