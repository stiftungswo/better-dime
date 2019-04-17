import Grid from '@material-ui/core/Grid/Grid';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { RateGroupSelect } from '../../form/entitySelect/RateGroupSelect';
import { StatusSelect } from '../../form/entitySelect/StatusSelect';
import { TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import { MarkdownField } from '../../form/fields/MarkdownField';
import { FormView, FormViewProps } from '../../form/FormView';
import { ActionButton } from '../../layout/ActionButton';
import { BreakdownTable } from '../../layout/BreakdownTable';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { AddIcon, ProjectIcon } from '../../layout/icons';
import PrintButton from '../../layout/PrintButton';
import { CustomerStore } from '../../stores/customerStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { OfferStore } from '../../stores/offerStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Offer, Project } from '../../types';
import compose from '../../utilities/compose';
import Effect, { OnChange } from '../../utilities/Effect';
import { empty } from '../../utilities/helpers';
import OfferDiscountSubform from './OfferDiscountSubform';
import Navigator from './OfferNavigator';
import OfferPositionSubformInline from './OfferPositionSubformInline';
import { offerSchema } from './offerSchema';

export type Props = {
  customerStore?: CustomerStore;
  employeeStore?: EmployeeStore;
  offer: Offer;
  offerStore?: OfferStore;
  projectStore?: ProjectStore;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
} & FormViewProps<Offer> &
  RouteComponentProps;

@compose(
  inject('customerStore', 'employeeStore', 'offerStore', 'projectStore', 'rateGroupStore', 'rateUnitStore', 'serviceStore'),
  observer,
)
class OfferForm extends React.Component<Props> {

  state = {
    loading: true,
  };
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
  }

  componentWillMount() {
    Promise.all([
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  render() {
    const { offer, offerStore } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(offer) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={offerSchema}
        initialValues={offer}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={
          offer && offer.id ? (
            <>
              <PrintButton path={`offers/${offer.id}/print`} color={'inherit'} />
              {!offer.project_id && (
                <ActionButton
                  action={() => offerStore!.createProject(offer.id!).then((p: Project) => this.props.history.push(`/projects/${p.id}`))}
                  color={'inherit'}
                  icon={ProjectIcon}
                  secondaryIcon={AddIcon}
                  title={'Projekt aus Offerte erstellen'}
                />
              )}
            </>
          ) : (
            undefined
          )
        }
        render={(props: FormikProps<Offer>) => {
          const locked = props.values.status === 2;
          return (
            <React.Fragment>
              <form onSubmit={props.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    {offer.id && <Navigator offer={offer} />}
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
                              <DimeField delayed required component={TextField} name={'name'} label={'Name'} disabled={locked} />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <Effect onChange={this.handleCustomerChange} />
                              <DimeField required component={CustomerSelect} name={'customer_id'} label={'Kunde'} disabled={locked} />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <DimeField
                                required
                                component={AddressSelect}
                                customerId={props.values.customer_id}
                                name={'address_id'}
                                label={'Adresse'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <DimeField required component={RateGroupSelect} name={'rate_group_id'} label={'Tarif'} disabled={locked} />
                            </Grid>
                            <Grid item xs={12} lg={8}>
                              <DimeField
                                required
                                component={EmployeeSelect}
                                name={'accountant_id'}
                                label={'Verantwortlicher Mitarbeiter'}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4}>
                              <DimeField required component={StatusSelect} name={'status'} label={'Status'} />
                            </Grid>
                            <Grid item xs={12}>
                              <DimeField
                                delayed
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
                          <DimeField
                            delayed
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
                        <DimeField
                          fullWidth={false}
                          delayed
                          component={CurrencyField}
                          name={'fixed_price'}
                          label={'Fixpreis'}
                          disabled={locked}
                        />
                      </DimePaper>
                    </Grid>
                  )}
                </Grid>
              </form>
            </React.Fragment>
          );
        }}
      />
    );
  }
}

export default withRouter(OfferForm);
