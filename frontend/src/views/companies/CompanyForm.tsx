import * as React from 'react';
import { Fragment } from 'react';
import { PeopleStore, Person } from '../../stores/peopleStore';
import { Field, FormikProps } from 'formik';
import { EmailField, SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { FormView, FormViewProps } from '../../form/FormView';
import AddressesSubformInline from '../persons/AddressesSubformInline';
import PhoneNumberSubformInline from '../persons/PhoneNumbersSubformInline';
import { RateGroupSelector } from 'src/form/entitySelector/RateGroupSelector';
import { Company } from 'src/stores/companyStore';
import { OverviewTable } from 'src/layout/OverviewTable';
import { inject } from 'mobx-react';
import { MainStore } from 'src/stores/mainStore';
import TableToolbar from 'src/layout/TableToolbar';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { DimePaper } from '../../layout/DimePaper';
import { companySchema } from './companySchema';

export interface Props extends FormViewProps<Company> {
  company: Company | undefined;
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
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

@inject('mainStore', 'peopleStore')
export default class CompanyForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  public constructor(props: Props) {
    super(props);

    props.peopleStore!.fetchAll().then(() => {
      this.setState({ loading: false });
    });
  }

  public get persons() {
    const { peopleStore } = this.props;
    const persons = this.props.company ? (this.props.company.persons ? this.props.company.persons : []) : [];

    let people: Person[] = [];
    people = peopleStore!.people.filter((p: Person) => persons.includes(p.id));

    return people;
  }

  public render() {
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
          <Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <DimePaper>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={TextField} name={'name'} label={'Name'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed multiline component={TextField} name={'comment'} label={'Bemerkungen'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={SwitchField} name={'hidden'} label={'Kontakt versteckt?'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field isMulti fullWidth delayed component={CustomerTagSelector} name={'tags'} label={'Tags'} />
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
                <Grid item xs={12}>
                  <AddressesSubformInline formikProps={props} name={'addresses'} />
                </Grid>
                <Grid item xs={12}>
                  <PhoneNumberSubformInline formikProps={props} name={'phone_numbers'} />
                </Grid>
                <Grid item xs={12}>
                  {!loading && (
                    <DimePaper>
                      <TableToolbar title={'Mitarbeiter'} addAction={'/persons/new'} />
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
          </Fragment>
        )}
      />
    );
  }
}
