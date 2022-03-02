import Grid from '@material-ui/core/Grid';
import {Warning} from '@material-ui/icons';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { VatSelect } from '../../form/entitySelect/VatSelect';
import { TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { MarkdownField } from '../../form/fields/MarkdownField';
import PercentageField from '../../form/fields/PercentageField';
import { FormView, FormViewProps } from '../../form/FormView';
import { ActionButton } from '../../layout/ActionButton';
import { BreakdownTable } from '../../layout/BreakdownTable';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { ESRIcon, InvoiceIcon, Renew, StatisticsIcon } from '../../layout/icons';
import PrintButton from '../../layout/PrintButton';
import { CostgroupStore } from '../../stores/costgroupStore';
import { CustomerStore } from '../../stores/customerStore';
import { EmployeeStore } from '../../stores/employeeStore';
import { InvoiceStore } from '../../stores/invoiceStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { Invoice } from '../../types';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import {isAfterArchivedUnitsCutoff} from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import PositionSubformInline from '../PositionSubformInline';
import InvoiceCostgroupSubform from './InvoiceCostgroupSubform';
import InvoiceDiscountSubform from './InvoiceDiscountSubform';
import Navigator from './InvoiceNavigator';
import InvoicePositionRenderer from './InvoicePositionRenderer';
import { invoiceSchema } from './invoiceSchema';

export interface Props extends FormViewProps<Invoice> {
  costgroupStore?: CostgroupStore;
  customerStore?: CustomerStore;
  employeeStore?: EmployeeStore;
  invoiceStore?: InvoiceStore;
  invoice: Invoice;
  rateUnitStore?: RateUnitStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('costgroupStore', 'customerStore', 'employeeStore', 'invoiceStore', 'rateUnitStore'),
  observer,
)
export default class InvoiceForm extends React.Component<Props> {
  state = {
    loading: true,
    date: undefined,
    dateRangeDirty: false,
  };

  componentWillMount() {
    Promise.all([
      this.props.costgroupStore!.fetchAll(),
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleTimeSpan = (invoice: Invoice) => {
    this.state.dateRangeDirty = false;
    // call onSubmit to save to avoid glitches when switching to the project tab and back.
    return this.props.invoiceStore!.updateTimeSpan(invoice).then(() => this.props.onSubmit(this.props.invoiceStore!.invoice!));
  }

  checkTimeSpan = (intlText: any) => (values: any) => {
    if (this.state.dateRangeDirty) {
      return { errorMessage: intlText('error_date_range_dirty') };
    }
    return {};
  }

  render() {
    const { invoice } = this.props;
    const intl = this.props.intl!;
    const intlText = wrapIntl(intl, 'view.invoice.form');
    let afterUnitInvalidation = false;

    if (!(empty(invoice) || this.props.loading || this.state.loading)) {
      afterUnitInvalidation = isAfterArchivedUnitsCutoff(invoice.created_at);
    }

    const costGroupsExist = !empty(invoice) && invoice.costgroup_distributions && invoice.costgroup_distributions.length > 0;

    return (
      <FormView
        intl={intl}
        paper={false}
        loading={empty(invoice) || this.props.loading}
        title={this.props.title}
        validationSchema={invoiceSchema}
        initialValues={invoice}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        validate={this.checkTimeSpan}
        appBarButtons={
          invoice && invoice.id ? (dirty: boolean) => (
            <>
              <PrintButton
                hasCitySelection
                path={`invoices/${invoice.id}/effort_report`}
                color={'inherit'}
                title={
                  invoice.project_id
                    ? intlText('print_effort_report')
                    : intlText('error_no_project')
                }
                icon={StatisticsIcon}
                disabled={!invoice.project_id}
              />
              <PrintButton
                path={`invoices/${invoice.id}/print_qr_bill`}
                color={'inherit'}
                title={
                  costGroupsExist
                    ? intlText('print_qr_bill')
                    : intlText('missing_cost_group_qr')}
                icon={ESRIcon}
                disabled={!costGroupsExist}
              />
              <PrintButton
                path={`invoices/${invoice.id}/print`}
                urlParams={{date: this.state.date}}
                color={'inherit'}
                title={
                  costGroupsExist
                    ? intlText('print_invoice')
                    : intlText('missing_cost_group_invoice')
                }
                icon={InvoiceIcon}
                disabled={!costGroupsExist}
              />
            </>
          ) : (
            undefined
          )
        }
        render={(props: FormikProps<Invoice>) => {
          return (
            <React.Fragment>
              <form onSubmit={props.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {invoice.id && <Navigator invoice={invoice} />}
                    <DimePaper>
                      <Grid container spacing={1}>
                        <Grid item xs={12} lg={8}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <DimeField delayed required component={TextField} name={'name'} label={intlText('general.name', true)} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField required component={CustomerSelect} name={'customer_id'} label={intlText('general.customer', true)} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField
                                required
                                component={AddressSelect}
                                customerId={props.values.customer_id}
                                name={'address_id'}
                                label={intlText('address')}
                              />
                            </Grid>
                            <Grid item xs={12} lg={8}>
                              <DimeField
                                required
                                component={EmployeeSelect}
                                name={'accountant_id'}
                                label={intlText('accountant')}
                              />
                            </Grid>
                            <Grid item xs={12} lg={4} style={{paddingTop: '24px'}}>
                              <DatePicker label={intlText('print_date')} value={this.state.date} onChange={(v: moment.Moment) => this.setState({['date']: v})} />
                            </Grid>
                            <Grid item xs={12} lg={5}>
                              <DimeDatePickerField
                                required
                                component={DatePicker}
                                name={'beginning'}
                                label={intlText('start_date')}
                                onChangeWrapped={(x: any) => {
                                  this.state.dateRangeDirty = true;
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeDatePickerField
                                required
                                component={DatePicker}
                                name={'ending'}
                                label={intlText('end_date')}
                                onChangeWrapped={(x: any) => {
                                  this.state.dateRangeDirty = true;
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} lg={1}>
                              <ConfirmationButton
                                {...(this.state.dateRangeDirty ? {style: {boxShadow: '0 0 1px 3px red'}} : {})}
                                onConfirm={() => this.handleTimeSpan(props.values)}
                                icon={Renew}
                                title={intlText('update_time_span')}
                                message={intlText('update_time_span_warning')}
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
                            maxRows={14}
                            name={'description'}
                            label={intlText('description')}
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
                            <FormattedMessage id="view.project.form.archived_rate_units_warning" />
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <DimePaper>
                      <PositionSubformInline tag={InvoicePositionRenderer} formikProps={props} name={'positions'} />
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <DimePaper>
                      <InvoiceCostgroupSubform formikProps={props} name={'costgroup_distributions'} />
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <DimePaper>
                      <InvoiceDiscountSubform formikProps={props} name={'discounts'} />
                    </DimePaper>
                  </Grid>
                  {invoice.id && (
                    <Grid item xs={12} lg={4}>
                      <DimePaper>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <FormHeader>
                              <FormattedMessage id={'view.offer.form.breakdown'} />
                            </FormHeader>
                          </Grid>
                          <Grid item xs={12}>
                            <BreakdownTable breakdown={invoice.breakdown} fixedPrice={invoice.fixed_price} />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <DimeField
                              fullWidth={false}
                              delayed
                              component={CurrencyField}
                              name={'fixed_price'}
                              label={intl.formatMessage({id: 'view.offer.form.fixed_price'})}
                            />
                          </Grid>
                          <Grid item sm={3} />
                          <Grid item xs={12} sm={4}>
                            <DimeField
                              component={VatSelect}
                              name={'fixed_price_vat'}
                              label={intl.formatMessage({id: 'view.offer.form.vat_rate'})}
                              placeholder={'7.7%'}
                              disabled={!invoice.fixed_price}
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
    );
  }
}
