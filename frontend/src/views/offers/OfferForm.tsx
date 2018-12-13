import * as React from 'react';
import { Fragment } from 'react';
import { Field, FormikProps } from 'formik';
import { TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Offer } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { StatusSelector } from '../../form/entitySelector/StatusSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import OfferDiscountSubform from './OfferDiscountSubform';
import { MarkdownField } from '../../form/fields/MarkdownField';
import CurrencyField from '../../form/fields/CurrencyField';
import { OfferStore } from '../../stores/offerStore';
import { FormHeader } from '../../layout/FormHeader';
import OfferPositionSubformInline from './OfferPositionSubformInline';
import PrintButton from '../../layout/PrintButton';
import { BreakdownTable } from '../../layout/BreakdownTable';
import Navigator from './OfferNavigator';
import { ProjectStore } from '../../stores/projectStore';
import { offerSchema } from './offerSchema';
import Effect, { OnChange } from '../../utilities/Effect';
import { CustomerStore } from '../../stores/customerStore';
import { CustomerSelector } from '../../form/entitySelector/CustomerSelector';
import { DimePaper } from '../../layout/DimePaper';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';

export interface Props extends FormViewProps<Offer> {
  customerStore?: CustomerStore;
  employeeStore?: EmployeeStore;
  offer: Offer;
  offerStore?: OfferStore;
  projectStore?: ProjectStore;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
}

@compose(
  inject('customerStore', 'employeeStore', 'offerStore', 'projectStore', 'rateGroupStore', 'rateUnitStore', 'serviceStore'),
  observer
)
export default class OfferForm extends React.Component<Props> {
  // set rateGroup based on selected customer.
  handleCustomerChange: OnChange<Offer> = (current, next, formik) => {
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
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  public render() {
    const { offer } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(offer) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={offerSchema}
        initialValues={offer}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={offer && offer.id ? <PrintButton path={`offers/${offer.id}/print`} color={'inherit'} /> : undefined}
        render={(props: FormikProps<Offer>) => {
          const locked = props.values.status === 2;
          return (
            <Fragment>
              <form onSubmit={props.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    {offer.id && <Navigator offer={offer} offerStore={this.props.offerStore!} projectStore={this.props.projectStore!} />}
                    <DimePaper>
                      <Grid container spacing={24}>
                        {locked && (
                          <Grid item xs={12}>
                            <p>
                              Die Offerte ist auf dem Status "Bestätigt" und kann deswegen nicht mehr bearbeitet werden. Um die Offerte
                              anzupassen, ändere erst den Status.
                            </p>
                          </Grid>
                        )}
                        <Grid item xs={12} lg={8}>
                          <Grid container spacing={8}>
                            <Grid item xs={12}>
                              <Field delayed fullWidth required component={TextField} name={'name'} label={'Name'} disabled={locked} />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Effect onChange={this.handleCustomerChange} />
                              <Field
                                fullWidth
                                required
                                component={CustomerSelector}
                                name={'customer_id'}
                                label={'Kunde'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Field
                                fullWidth
                                required
                                component={AddressSelector}
                                customerId={props.values.customer_id}
                                name={'address_id'}
                                label={'Adresse'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Field
                                fullWidth
                                required
                                component={RateGroupSelector}
                                name={'rate_group_id'}
                                label={'Tarif'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={8}>
                              <Field
                                fullWidth
                                required
                                component={EmployeeSelector}
                                name={'accountant_id'}
                                label={'Verantwortlicher Mitarbeiter'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Field fullWidth required component={StatusSelector} name={'status'} label={'Status'} />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                delayed
                                fullWidth
                                required
                                component={TextField}
                                name={'short_description'}
                                label={'Kurzbeschreibung'}
                                disabled={locked}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            delayed
                            fullWidth
                            required
                            component={MarkdownField}
                            multiline
                            rowsMax={14}
                            name={'description'}
                            label={'Beschreibung'}
                            disabled={locked}
                          />
                        </Grid>
                      </Grid>
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12}>
                    <DimePaper>
                      <OfferPositionSubformInline formikProps={props} name={'positions'} disabled={locked} />
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <DimePaper>
                      <OfferDiscountSubform formikProps={props} name={'discounts'} disabled={locked} />
                    </DimePaper>
                  </Grid>
                  {offer.id && (
                    <Grid item xs={12} lg={4}>
                      <DimePaper>
                        <FormHeader>Berechnung</FormHeader>
                        <BreakdownTable breakdown={offer.breakdown} />
                        <Field delayed component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} disabled={locked} />
                      </DimePaper>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Fragment>
          );
        }}
      />
    );
  }
}
