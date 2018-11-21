import * as React from 'react';
import { Fragment } from 'react';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import { TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { DimePaper, hasContent } from '../../layout/DimeLayout';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Invoice } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { RouteComponentProps, withRouter } from 'react-router';
import { MarkdownField } from '../../form/fields/MarkdownField';
import CurrencyField from '../../form/fields/CurrencyField';
import { InvoiceStore } from '../../stores/invoiceStore';
import { FormHeader } from '../../layout/FormHeader';
import PrintButton from '../../layout/PrintButton';
import { DatePicker } from '../../form/fields/DatePicker';
import InvoicePositionSubformInline from './InvoicePositionSubformInline';
import InvoiceDiscountSubform from './InvoiceDiscountSubform';
import InvoiceCostgroupSubform from './InvoiceCostgroupSubform';
import { BreakdownTable } from '../../layout/BreakdownTable';

interface NavigatorProps extends RouteComponentProps {
  invoice: Invoice;
}

const Navigator = withRouter(({ invoice: { project_id, offer_id, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  const projects = project_id ? [project_id] : [];
  return (
    <Tabs value={offers.length + projects.length}>
      {offers.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={`Offerte ${pId}`} />
      ))}
      {projects.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
      ))}
      <Tab label={`Rechnung ${id}`} />
    </Tabs>
  );
});

const schema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  description: yup.string().required(),
  fixed_price: yup.number().nullable(true),
  start: yup.date().required(),
  end: yup.date().required(),
  discounts: yup.array(
    yup.object({
      name: yup.string().required(),
      percentage: yup.boolean().required(),
      value: yup.number().required(),
    })
  ),
  positions: yup.array(
    yup.object({
      amount: yup.number().required(),
      description: yup.string().required(),
      order: yup
        .mixed()
        .transform(value => (value === '' ? null : Number(value)))
        .nullable(true),
      price_per_rate: yup.number().required(),
      project_position_id: yup.number().nullable(true),
      rate_unit_id: yup.number().required(),
      vat: yup.number().required(),
    })
  ),
  costgroup_distributions: yup
    .array(
      yup.object({
        costgroup_number: yup.number().required(),
        weight: yup.number().required(),
      })
    )
    .min(1),
});

export interface Props extends FormViewProps<Invoice> {
  mainStore?: MainStore;
  invoiceStore?: InvoiceStore;
  invoice: Invoice;
}

@compose(
  inject('invoiceStore'),
  observer
)
export default class InvoiceForm extends React.Component<Props> {
  public render() {
    const { invoice } = this.props;

    return (
      <FormView
        paper={false}
        loading={!hasContent(invoice) || this.props.loading}
        title={this.props.title}
        validationSchema={schema}
        initialValues={invoice}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        appBarButtons={invoice && invoice.id ? <PrintButton path={`invoices/${invoice.id}/print`} color={'inherit'} /> : undefined}
        render={(props: FormikProps<Invoice>) => {
          return (
            <Fragment>
              <form onSubmit={props.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs={12} lg={8}>
                    {invoice.id && <Navigator invoice={invoice} />}
                    <DimePaper>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <Field delayed fullWidth required component={TextField} name={'name'} label={'Name'} />
                        </Grid>
                        <Grid item xs={12} lg={8}>
                          <Field fullWidth required component={AddressSelector} name={'address_id'} label={'Kunde'} />
                        </Grid>
                        <Grid item xs={12} lg={8}>
                          <Field
                            fullWidth
                            required
                            component={EmployeeSelector}
                            name={'accountant_id'}
                            label={'Verantwortlicher Mitarbeiter'}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Field fullWidth required component={DatePicker} name={'start'} label={'Startdatum'} />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Field fullWidth required component={DatePicker} name={'end'} label={'Enddatum'} />
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
                          />
                        </Grid>
                      </Grid>
                    </DimePaper>
                  </Grid>

                  <Grid item xs={12}>
                    <DimePaper>
                      <InvoicePositionSubformInline formikProps={props} name={'positions'} />
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
                        <FormHeader>Berechnung</FormHeader>
                        <BreakdownTable breakdown={invoice.breakdown} />
                        <Field delayed component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />
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
