import * as React from 'react';
import { Fragment } from 'react';
import { Person, PeopleStore } from '../../stores/peopleStore';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import { EmailField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { hasContent } from '../../layout/DimeLayout';
import { FormView, FormViewProps } from '../../form/FormView';
import { FormHeader } from '../../layout/FormHeader';
import AddressesSubformInline from '../persons/AddressesSubformInline';
import PhoneNumberSubformInline from '../persons/PhoneNumbersSubformInline';
import { RateGroupSelector } from 'src/form/entitySelector/RateGroupSelector';
import { Company } from 'src/stores/companyStore';
import { OverviewTable } from 'src/layout/OverviewTable';
import { inject } from 'mobx-react';
import { MainStore } from 'src/stores/mainStore';
import TableToolbar from 'src/layout/TableToolbar';
import { toJS } from 'mobx';

export interface Props extends FormViewProps<Person> {
  company: Company | undefined;
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
}

const companySchema = yup.object({
  archived: yup.boolean(),
  email: yup.string().required(),
  name: yup.string().required(),
  company_id: yup.number().nullable(true),
  rate_group_id: yup.number().required(),
  addresses: yup.array(
    yup.object({
      city: yup.string().required(),
      country: yup.string().required(),
      description: yup.string(),
      postcode: yup.number().required(),
      street: yup.string().required(),
      supplement: yup.string().nullable(true),
    })
  ),
  phone_numbers: yup.array(
    yup.object({
      category: yup.number().required(),
      number: yup.string().required(),
    })
  ),
});

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
        title={this.props.title}
        validationSchema={companySchema}
        loading={!hasContent(company) || this.props.loading}
        initialValues={{ ...company }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <Fragment>
            <FormHeader> Allgemeine Informationen </FormHeader>
            <form onSubmit={props.handleSubmit}>
              <Grid container={true} spacing={16}>
                <Grid item={true} xs={12} sm={6}>
                  <Field component={TextField} name={'name'} label={'Name'} fullWidth={true} />
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                  <Field component={EmailField} name={'email'} label={'E-Mail'} fullWidth={true} />
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                  <Field component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} fullWidth={true} />
                </Grid>
              </Grid>

              <br />
              <AddressesSubformInline formikProps={props} name={'addresses'} />

              <br />
              <PhoneNumberSubformInline formikProps={props} name={'phone_numbers'} />

              <br />
              {!loading && (
                <>
                  <TableToolbar title={'Mitarbeiter'} />
                  <OverviewTable
                    data={this.persons}
                    onClickRow={(m: Person) => {
                      mainStore!.navigateTo(`/persons/${m.id}`);
                    }}
                    columns={[
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
                        format: p => {
                          console.log(p);
                          return <>{p.addresses ? (p.addresses.length > 0 ? p.addresses[0].street : '') : ''}</>;
                        },
                      },
                    ]}
                  />
                </>
              )}
            </form>
          </Fragment>
        )}
      />
    );
  }
}
