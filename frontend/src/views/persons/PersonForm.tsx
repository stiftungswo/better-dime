import * as React from 'react';
import { Fragment } from 'react';
import { Person } from '../../types';
import { FormikProps } from 'formik';
import { DimeField } from '../../form/fields/formik';
import { EmailField, SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { FormView, FormViewProps } from '../../form/FormView';
import AddressesSubformInline from './AddressesSubformInline';
import PhoneNumberSubformInline from './PhoneNumbersSubformInline';
import { CompanySelect } from '../../form/entitySelect/CompanySelect';
import { RateGroupSelect } from 'src/form/entitySelect/RateGroupSelect';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { DimePaper } from '../../layout/DimePaper';
import { personSchema } from './personSchema';
import { CompanyStore } from '../../stores/companyStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { CustomerTagStore } from '../../stores/customerTagStore';

export interface Props extends FormViewProps<Person> {
  companyStore?: CompanyStore;
  customerTagStore?: CustomerTagStore;
  person?: Person;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('companyStore', 'customerTagStore', 'rateGroupStore'),
  observer
)
export default class PersonForm extends React.Component<Props> {
  public state = {
    loading: true,
  };

  componentWillMount() {
    Promise.all([this.props.companyStore!.fetchAll(), this.props.customerTagStore!.fetchAll(), this.props.rateGroupStore!.fetchAll()]).then(
      () => this.setState({ loading: false })
    );
  }

  public render() {
    const { person } = this.props;

    return (
      <FormView
        paper={false}
        title={this.props.title}
        validationSchema={personSchema}
        loading={empty(person) || this.props.loading || this.state.loading}
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
                        <DimeField fullWidth delayed component={TextField} name={'salutation'} label={'Anrede'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={TextField} name={'first_name'} label={'Vorname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={TextField} name={'last_name'} label={'Nachname'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={EmailField} name={'email'} label={'E-Mail'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={CompanySelect} name={'company_id'} label={'Firma'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={TextField} name={'department'} label={'Zuständigkeitsbereich'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed multiline component={TextField} name={'comment'} label={'Bemerkungen'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={RateGroupSelect} name={'rate_group_id'} label={'Tarif'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField fullWidth delayed component={SwitchField} name={'hidden'} label={'Kontakt versteckt?'} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DimeField isMulti fullWidth delayed component={CustomerTagSelect} name={'tags'} label={'Tags'} />
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
