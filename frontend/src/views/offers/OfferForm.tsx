import Grid from '@material-ui/core/Grid/Grid';
import {Warning} from '@material-ui/icons';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { RateGroupSelect } from '../../form/entitySelect/RateGroupSelect';
import { StatusSelect } from '../../form/entitySelect/StatusSelect';
import { VatSelect } from '../../form/entitySelect/VatSelect';
import { TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeField } from '../../form/fields/formik';
import { MarkdownField } from '../../form/fields/MarkdownField';
import { FormView, FormViewProps } from '../../form/FormView';
import { ActionButton } from '../../layout/ActionButton';
import { BreakdownTable } from '../../layout/BreakdownTable';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { AddIcon, ProjectIcon } from '../../layout/icons';
import PrintButton from '../../layout/PrintButton';
import { CostgroupStore } from '../../stores/costgroupStore';
import { CustomerStore } from '../../stores/customerStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { OfferStore } from '../../stores/offerStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Offer, Project } from '../../types';
import compose from '../../utilities/compose';
import Effect, { OnChange } from '../../utilities/Effect';
import { empty } from '../../utilities/helpers';
import {isAfterArchivedUnitsCutoff} from '../../utilities/validation';
import PositionSubformInline from '../PositionSubformInline';
import AddCCDialog from './AddCCDialog';
import OfferDiscountSubform from './OfferDiscountSubform';
import Navigator from './OfferNavigator';
import OfferPositionRenderer from './OfferPositionRenderer';
import { offerSchema } from './offerSchema';

export type Props = {
  customerStore?: CustomerStore;
  employeeStore?: EmployeeStore;
  offer: Offer;
  showDateField?: boolean;
  offerStore?: OfferStore;
  projectStore?: ProjectStore;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
  costgroupStore?: CostgroupStore;
  projectCategoryStore?: ProjectCategoryStore;
} & FormViewProps<Offer> &
  RouteComponentProps;

@compose(
  inject('customerStore', 'employeeStore', 'offerStore', 'projectStore', 'rateGroupStore', 'rateUnitStore', 'serviceStore', 'costgroupStore', 'projectCategoryStore'),
  observer,
)
class OfferForm extends React.Component<Props> {

  state = {
    loading: true,
    date: undefined,
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
      this.props.costgroupStore!.fetchAll(),
      this.props.projectCategoryStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleClose = () => {
    this.props.offerStore!.creatingProject = false;
  }

  handleConfirm = (offer: Offer, costgroup: number, category: number) => {
    this.props.offerStore!.createProject(offer.id!, costgroup, category).then((p: Project) => this.props.history.push(`/projects/${p.id}`));
  }

  render() {
    const { offer, offerStore } = this.props;
    let afterUnitInvalidation = false;

    if (!(empty(offer) || this.props.loading || this.state.loading)) {
      afterUnitInvalidation = isAfterArchivedUnitsCutoff(offer.created_at);
    }
    return (
      <>
        {this.props.offerStore!.creatingProject && <AddCCDialog onConfirm={(costgroup, category) => this.handleConfirm(offer, costgroup, category)} onClose={this.handleClose} />}
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
                <PrintButton hasCitySelection path={`offers/${offer.id}/print`} urlParams={{date: this.state.date}} color={'inherit'} />
                {!offer.project_id && (
                  <ActionButton
                    action={() => this.props.offerStore!.creatingProject = true}
                    color={'inherit'}
                    icon={ProjectIcon}
                    secondaryIcon={AddIcon}
                    title={'Projekt aus Offerte erstellen'}
                  />
                )}
              </>
            ) : undefined
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
                              {this.props.showDateField &&
                                <Grid item xs={12} lg={4}>
                                  <DatePicker label={'Ausstellungsdatum'} value={this.state.date} onChange={v => this.setState({['date']: v})} disabled={locked} />
                                </Grid>
                              }
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
                      {props.status! && props.status!.archived_units && afterUnitInvalidation && (
                        <>
                          <Grid container direction="row" alignItems="center" style={{marginLeft: '10px', paddingBottom: '5px'}}>
                            <Grid item>
                              <Warning color={'error'}/>
                            </Grid>
                            <Grid item style={{color: 'red', marginLeft: '5px'}}>
                              Services mit archivierten Einheiten vorhanden!
                            </Grid>
                          </Grid>
                        </>
                      )}
                      <DimePaper>
                        <PositionSubformInline tag={OfferPositionRenderer} formikProps={props} name={'positions'} disabled={locked} />
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
                          <Grid container spacing={8}>
                            <Grid item xs={12}>
                              <FormHeader>Berechnung</FormHeader>
                            </Grid>
                            <Grid item xs={12}>
                              <BreakdownTable breakdown={offer.breakdown} fixedPrice={offer.fixed_price} />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <DimeField
                                fullWidth={false}
                                delayed
                                component={CurrencyField}
                                name={'fixed_price'}
                                label={'Fixpreis'}
                              />
                            </Grid>
                            <Grid item sm={3} />
                            <Grid item xs={12} sm={4}>
                              <DimeField
                                component={VatSelect}
                                name={'fixed_price_vat'}
                                label={'MwSt. Satz'}
                                placeholder={'7.7%'}
                                disabled={!offer.fixed_price}
                              />
                            </Grid>
                          </Grid>
                        </DimePaper>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </React.Fragment>
            );
          }}
        />
      </>
    );
  }
}

export default withRouter(OfferForm);
