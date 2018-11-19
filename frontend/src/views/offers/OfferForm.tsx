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
import { Invoice, Offer, Project } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { StatusSelector } from '../../form/entitySelector/StatusSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import OfferDiscountSubform from './OfferDiscountSubform';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { RouteComponentProps, withRouter } from 'react-router';
import { MarkdownField } from '../../form/fields/MarkdownField';
import CurrencyField from '../../form/fields/CurrencyField';
import { OfferStore } from '../../stores/offerStore';
import { FormHeader } from '../../layout/FormHeader';
import OfferPositionSubformInline from './OfferPositionSubformInline';

interface NavigatorProps extends RouteComponentProps {
  offer: Offer;
  offerStore: OfferStore;
}

const Navigator = withRouter(({ offer: { project_ids, invoice_ids, id }, history, offerStore }: NavigatorProps) => (
  <Tabs value={0}>
    <Tab label={`Offerte ${id}`} />
    {project_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
    ))}
    {project_ids.length === 0 && (
      <Tab
        onClick={() => offerStore.createProject(id!).then((p: Project) => history.push(`/projects/${p.id}`))}
        label={'+ Projekt erstellen'}
      />
    )}
    {invoice_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
    <Tab
      onClick={() => offerStore.createInvoice(id!).then((i: Invoice) => history.push(`invoices/${i.id}`))}
      label={'+ Rechnung erstellen'}
    />
  </Tabs>
));

const schema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  description: yup.string().required(),
  fixed_price: yup.boolean(),
  rate_group_id: yup.number().required(),
  short_description: yup.string().required(),
  status: yup.number().required(),
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
      order: yup.number().required(),
      price_per_rate: yup.number().required(),
      rate_unit_id: yup.number().required(),
      service_id: yup.number().required(),
      vat: yup.number().required(),
    })
  ),
});

export interface Props extends FormViewProps<Offer> {
  mainStore?: MainStore;
  offerStore?: OfferStore;
  offer: Offer;
}

@compose(
  inject('mainStore', 'offerStore'),
  observer
)
export default class OfferForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { offer, mainStore } = this.props;

    const BreakdownLine = ({ title, value }: { title: string; value: number }) => (
      <p>
        <b>{title}</b>: {mainStore!.formatCurrency(value)}
      </p>
    );

    return (
      <FormView
        paper={false}
        loading={!hasContent(offer) || this.props.loading}
        title={this.props.title}
        validationSchema={schema}
        initialValues={offer}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12} lg={8}>
                  {offer.id && <Navigator offer={offer} offerStore={this.props.offerStore!} />}
                  <DimePaper>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Field fullWidth required component={TextField} name={'name'} label={'Name'} />
                      </Grid>
                      <Grid item xs={12} lg={8}>
                        <Field fullWidth required component={AddressSelector} name={'address_id'} label={'Kunde'} />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <Field fullWidth required component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
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
                      <Grid item xs={12} lg={4}>
                        <Field fullWidth required component={StatusSelector} name={'status'} label={'Status'} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field fullWidth required component={TextField} name={'short_description'} label={'Kurzbeschreibung'} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
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
                    <OfferPositionSubformInline formikProps={props} mainStore={this.props.mainStore} name={'positions'} />
                  </DimePaper>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <DimePaper>
                    <OfferDiscountSubform formikProps={props} name={'discounts'} />
                  </DimePaper>
                </Grid>
                {offer.id && (
                  <Grid item xs={12} lg={6}>
                    <DimePaper>
                      <FormHeader>Berechnung</FormHeader>
                      <BreakdownLine title={'Subtotal'} value={offer.breakdown.subtotal} />
                      <BreakdownLine title={'Davon MwSt.'} value={offer.breakdown.vatTotal} />
                      <BreakdownLine title={'Total Abzüge'} value={offer.breakdown.discountTotal} />
                      <BreakdownLine title={'Total'} value={offer.breakdown.total} />
                      <Field component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />
                    </DimePaper>
                  </Grid>
                )}
              </Grid>
            </form>
          </Fragment>
        )}
      />
    );
  }
}
