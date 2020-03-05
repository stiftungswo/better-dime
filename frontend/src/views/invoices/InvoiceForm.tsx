import Grid from '@material-ui/core/Grid/Grid';
import {Warning} from '@material-ui/icons';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AddressSelect } from '../../form/entitySelect/AddressSelect';
import { CustomerSelect } from '../../form/entitySelect/CustomerSelect';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeField } from '../../form/fields/formik';
import { MarkdownField } from '../../form/fields/MarkdownField';
import PercentageField from '../../form/fields/PercentageField';
import { FormView, FormViewProps } from '../../form/FormView';
import { BreakdownTable } from '../../layout/BreakdownTable';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import { ESRIcon, InvoiceIcon, StatisticsIcon } from '../../layout/icons';
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
}

@compose(
  inject('costgroupStore', 'customerStore', 'employeeStore', 'invoiceStore', 'rateUnitStore'),
  observer,
)
export default class InvoiceForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentWillMount() {
    Promise.all([
      this.props.costgroupStore!.fetchAll(),
      this.props.customerStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  render() {
    const { invoice } = this.props;
    let afterUnitInvalidation = false;

    if (!(empty(invoice) || this.props.loading || this.state.loading)) {
      afterUnitInvalidation = isAfterArchivedUnitsCutoff(invoice.created_at);
    }

    const costGroupsExist = !empty(invoice) && invoice.costgroup_distributions && invoice.costgroup_distributions.length > 0;

    return (
      <FormView
        paper={false}
        loading={empty(invoice) || this.props.loading}
        title={this.props.title}
        validationSchema={invoiceSchema}
        initialValues={invoice}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={
          invoice && invoice.id ? (
            <>
              <PrintButton
                path={`invoices/${invoice.id}/effort_report`}
                color={'inherit'}
                title={
                  invoice.project_id
                    ? 'Aufwandsrapport drucken'
                    : 'Da die Rechnung kein verlinktes Projekt hat, kann kein Aufwandrapport erzeugt werden.'
                }
                icon={StatisticsIcon}
                disabled={!invoice.project_id}
              />
              <PrintButton
                path={`invoices/${invoice.id}/print_esr`}
                color={'inherit'}
                title={
                  costGroupsExist
                    ? 'Einzahlungsschein drucken'
                    : 'Es muss eine Kostenstelle zugewiesen werden bevor der Einzahlungsschein gedruckt werden kann.'}
                icon={ESRIcon}
                disabled={!costGroupsExist}
              />
              <PrintButton
                path={`invoices/${invoice.id}/print`}
                color={'inherit'}
                title={
                  costGroupsExist
                    ? 'Rechnung drucken'
                    : 'Es muss eine Kostenstelle zugewiesen werden bevor die Rechnung gedruckt werden kann.'
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
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    {invoice.id && <Navigator invoice={invoice} />}
                    <DimePaper>
                      <Grid container spacing={8}>
                        <Grid item xs={12} lg={8}>
                          <Grid container spacing={8}>
                            <Grid item xs={12}>
                              <DimeField delayed required component={TextField} name={'name'} label={'Name'} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField required component={CustomerSelect} name={'customer_id'} label={'Kunde'} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField
                                required
                                component={AddressSelect}
                                customerId={props.values.customer_id}
                                name={'address_id'}
                                label={'Adresse'}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <DimeField
                                required
                                component={EmployeeSelect}
                                name={'accountant_id'}
                                label={'Verantwortlicher Mitarbeiter'}
                              />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField required component={DatePicker} name={'beginning'} label={'Startdatum'} />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                              <DimeField required component={DatePicker} name={'ending'} label={'Enddatum'} />
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
                        <Grid container spacing={8}>
                          <Grid item xs={12}>
                            <FormHeader>Berechnung</FormHeader>
                          </Grid>
                          <Grid item xs={12}>
                            <BreakdownTable breakdown={invoice.breakdown} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DimeField
                              fullWidth={false}
                              delayed
                              component={CurrencyField}
                              name={'fixed_price'}
                              label={'Fixpreis'}
                              margin={'normal'}
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
