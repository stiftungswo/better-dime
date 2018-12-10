import * as React from 'react';
import { Fragment } from 'react';
import { Person } from '../../stores/peopleStore';
import { Field, FormikProps } from 'formik';
import { EmailField, SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { FormView, FormViewProps } from '../../form/FormView';
import AddressesSubformInline from './AddressesSubformInline';
import PhoneNumberSubformInline from './PhoneNumbersSubformInline';
import { CompanySelector } from '../../form/entitySelector/CompanySelector';
import { RateGroupSelector } from 'src/form/entitySelector/RateGroupSelector';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { DimePaper } from '../../layout/DimePaper';
import { personSchema } from './personSchema';

export interface Props extends FormViewProps<Person> {
  person?: Person;
}

export default class PersonForm extends React.Component<Props> {
  public render() {
    const { person } = this.props;

    return (
      <FormView
        paper={false}
        title={this.props.title}
        validationSchema={personSchema}
        loading={empty(person) || this.props.loading}
        initialValues={{ ...person }}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Person>) => (
          <Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  <DimePaper>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={TextField} name={'salutation'} label={'Anrede'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={TextField} name={'first_name'} label={'Vorname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={TextField} name={'last_name'} label={'Nachname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={CompanySelector} name={'company_id'} label={'Firma'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={TextField} name={'department'} label={'Zuständigkeitsbereich'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed multiline component={TextField} name={'comment'} label={'Bemerkungen'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field fullWidth delayed component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
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
              </Grid>
            </form>
          </Fragment>
        )}
      />
    );
  }
}
