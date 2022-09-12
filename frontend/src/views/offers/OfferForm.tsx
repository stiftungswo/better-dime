import {Warning} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { LocationSelect } from '../../form/entitySelect/LocationSelect';
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
import { LocationStore } from '../../stores/locationStore';
import { OfferStore } from '../../stores/offerStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { ProjectStore } from '../../stores/projectStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceCategoryStore } from '../../stores/serviceCategoryStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Location, Offer, Project } from '../../types';
import compose from '../../utilities/compose';
import Effect, { OnChange } from '../../utilities/Effect';
import { empty } from '../../utilities/helpers';
import {isAfterArchivedUnitsCutoff} from '../../utilities/validation';
import PositionSubformInline from '../PositionSubformInline';
import { OfferCategorySubform } from '../shared_opi/CategorySubform';
import { OfferCostgroupSubform } from '../shared_opi/CostgroupSubform';
import AddCCDialog from './AddCCDialog';
import OfferDiscountSubform from './OfferDiscountSubform';
import Navigator from './OfferNavigator';
import OfferPendingWarningDialog from './OfferPendingWarningDialog';
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
  locationStore?: LocationStore;
  serviceCategoryStore?: ServiceCategoryStore;
  intl?: IntlShape;
} & FormViewProps<Offer> &
  RouteComponentProps;

@compose(
  injectIntl,
  inject(
    'customerStore',
    'employeeStore',
    'offerStore',
    'projectStore',
    'rateGroupStore',
    'rateUnitStore',
    'serviceStore',
    'costgroupStore',
    'projectCategoryStore',
    'locationStore',
    'serviceCategoryStore',
  ),
  observer,
)
class OfferForm extends React.Component<Props> {

  state = {
    loading: true,
    date: undefined,
    pendingWarningOpen: false,
  };
  // set rateGroup based on selected customer.
  handleCustomerChange: OnChange<Offer> = (current, next, formik) => {
    if (current.values.customer_id !== next.values.customer_id) {
      if (!current.values.customer_id && !current.values.rate_group_id) {
        const customer = this.props.customerStore!.entities.find(a => a.id === next.values.customer_id);
        if (customer) {
          formik.setFieldValue('rate_group_id', customer.rate_group_id);
        }
      }
    }
  }

  handleLocationSelection = (newLocation: Location) => {
    const { offer, onSubmit } = this.props;
    offer.location_id = newLocation.id;
    onSubmit(offer);
  }

  componentDidMount() {
    Promise.all([
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
      this.props.costgroupStore!.fetchAll(),
      this.props.projectCategoryStore!.fetchAll(),
      this.props.locationStore!.fetchAll(),
      this.props.serviceCategoryStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleClose = () => {
    this.props.offerStore!.creatingProject = false;
  }

  doCreateProject = (offer: Offer, costgroup: number | null, category: number | null) => {
      this.props.offerStore!.createProject(offer.id!, costgroup, category).then((p: Project) => this.props.history.push(`/projects/${p.id}`));
  }

  handleConfirm = (offer: Offer, costgroup: number, category: number) => {
    this.doCreateProject(offer, costgroup, category);
  }
  tryCreateProject = (offer: Offer) => {
    if (offer.costgroup_distributions && offer.costgroup_distributions.length > 0
       && offer.category_distributions && offer.category_distributions.length > 0) {
        this.doCreateProject(offer, null, null);
    } else {
      // for legacy projects, open the popup asking for costgroup & category.
      this.props.offerStore!.creatingProject = true;
    }
  }
  acceptThenCreate = (offer: Offer) => {
    // set offer status to accepted
    offer.status = 2;
    this.props.onSubmit(offer);
    this.tryCreateProject(offer);
  }
  handleCreateProject = (offer: Offer) => {
    // status = Entwurf / Ausstehend -> show warning
    if (offer.status === 0 || offer.status === 1) {
      this.setState({...this.state, pendingWarningOpen: true});
    } else {
      this.tryCreateProject(offer);
    }
  }

  render() {
    const { offer, offerStore } = this.props;
    const intl = this.props.intl!;
    let afterUnitInvalidation = false;

    if (!(empty(offer) || this.props.loading || this.state.loading)) {
      afterUnitInvalidation = isAfterArchivedUnitsCutoff(offer.created_at);
    }
    return (
      <>
        {this.props.offerStore!.creatingProject && <AddCCDialog onConfirm={(costgroup, category) => this.handleConfirm(offer, costgroup, category)} onClose={this.handleClose} />}
        <FormView
          intl={intl}
          paper={false}
          loading={empty(offer) || this.props.loading || this.state.loading}
          title={this.props.title}
          validationSchema={offerSchema}
          initialValues={offer}
          onSubmit={this.props.onSubmit}
          submitted={this.props.submitted}
          appBarButtons={
            offer && offer.id ? (dirty: boolean) => (
              <>
                <PrintButton
                  path={`offers/${offer.id}/print`}
                  urlParams={{date: this.state.date, city: offer.location_id || undefined}}
                  color={'inherit'}
                  hasCitySelection={!offer.location_id}
                  citySelectionSaveCallback={this.handleLocationSelection}
                />
                {!offer.project_id && (
                  <>
                    <ActionButton
                      action={() => this.handleCreateProject(offer)}
                      color={'inherit'}
                      icon={ProjectIcon}
                      secondaryIcon={AddIcon}
                      disabled={dirty}
                      title={dirty ? intl.formatMessage({id: 'view.offer.form.save_first'}) : intl.formatMessage({id: 'view.offer.form.create_project_from_offer'})}
                    />
                    {this.state.pendingWarningOpen && (
                      <OfferPendingWarningDialog
                        open
                        onYes={() => this.acceptThenCreate(offer)}
                        onNo={() => this.tryCreateProject(offer)}
                        onClose={() => this.setState({...this.state, pendingWarningOpen: false})}
                      />
                    )}
                  </>
                )}
              </>
            ) : undefined
          }
          render={(props: FormikProps<Offer>) => {
            const locked = props.values.status === 2;
            return (
              <React.Fragment>
                <form onSubmit={props.handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {offer.id && <Navigator offer={offer} />}
                      <DimePaper>
                        <Grid container spacing={3}>
                          {locked && (
                            <Grid item xs={12}>
                              <p>
                                <FormattedMessage id={'view.offer.form.locked_offer'} />
                              </p>
                            </Grid>
                          )}
                          <Grid item xs={12} lg={8}>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <DimeField delayed required component={TextField} name={'name'} label={intl.formatMessage({id: 'general.name'})} disabled={locked} />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <Effect onChange={this.handleCustomerChange} />
                                <DimeField required component={CustomerSelect} name={'customer_id'} label={intl.formatMessage({id: 'view.offer.form.customer'})} disabled={locked} />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <DimeField
                                  required
                                  component={AddressSelect}
                                  customerId={props.values.customer_id}
                                  name={'address_id'}
                                  label={intl.formatMessage({id: 'view.offer.form.address'})}
                                  disabled={locked}
                                />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <DimeField required component={RateGroupSelect} name={'rate_group_id'} label={intl.formatMessage({id: 'general.rate'})} disabled={locked} />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <DimeField
                                  required
                                  component={EmployeeSelect}
                                  name={'accountant_id'}
                                  label={intl.formatMessage({id: 'general.accountant'})}
                                  disabled={locked}
                                />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <DimeField
                                  component={LocationSelect}
                                  name={'location_id'}
                                  label={intl.formatMessage({id: 'view.offer.form.location'})}
                                  disabled={locked}
                                />
                              </Grid>
                              <Grid item xs={12} lg={4}>
                                <DimeField
                                  required
                                  component={StatusSelect}
                                  name={'status'}
                                  label={intl.formatMessage({id: 'view.offer.form.status'})}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <DimeField
                                  delayed
                                  required
                                  component={TextField}
                                  name={'short_description'}
                                  label={intl.formatMessage({id: 'view.offer.form.short_description'})}
                                  disabled={locked}
                                />
                              </Grid>
                              {this.props.showDateField &&
                                <Grid item xs={12} lg={4}>
                                  <DatePicker label={intl.formatMessage({id: 'view.offer.form.date'})} value={this.state.date} onChange={v => this.setState({['date']: v})} disabled={locked} />
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
                              label={intl.formatMessage({id: 'view.offer.form.description'})}
                              disabled={locked}
                            />
                          </Grid>
                        </Grid>
                      </DimePaper>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={5}>
                          <DimePaper>
                            <OfferCostgroupSubform formikProps={props} name={'costgroup_distributions'} />
                          </DimePaper>
                        </Grid>
                        <Grid item xs={12} lg={5}>
                          <DimePaper>
                            <OfferCategorySubform formikProps={props} name={'category_distributions'} />
                          </DimePaper>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      {props.status! && props.status!.archived_units && afterUnitInvalidation && (
                        <>
                          <Grid container direction="row" alignItems="center" style={{marginLeft: '10px', paddingBottom: '5px'}}>
                            <Grid item>
                              <Warning color={'error'}/>
                            </Grid>
                            <Grid item style={{color: 'red', marginLeft: '5px'}}>
                              <FormattedMessage id={'view.offer.form.archived_rate_groups_warning'} />
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
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <FormHeader>
                                <FormattedMessage id={'view.offer.form.breakdown'} />
                              </FormHeader>
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
                                label={intl.formatMessage({id: 'view.offer.form.fixed_price'})}
                                disabled={locked}
                              />
                            </Grid>
                            <Grid item sm={3} />
                            <Grid item xs={12} sm={4}>
                              <DimeField
                                component={VatSelect}
                                name={'fixed_price_vat'}
                                label={intl.formatMessage({id: 'view.offer.form.vat_rate'})}
                                placeholder={'7.7%'}
                                disabled={!offer.fixed_price || locked}
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
