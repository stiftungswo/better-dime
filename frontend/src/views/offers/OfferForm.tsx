import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import { TextField } from '../../form/fields/common';
import Grid, { GridSize } from '@material-ui/core/Grid/Grid';
import { DimePaper, hasContent } from '../../layout/DimeLayout';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Offer } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import OfferPositionSubform from './OfferPositionSubform';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { StatusSelector } from '../../form/entitySelector/StatusSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import OfferDiscountSubform from './OfferDiscountSubform';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { RouteComponentProps, withRouter } from 'react-router';
import { MarkdownField } from '../../form/fields/MarkdownField';
import CurrencyField from '../../form/fields/CurrencyField';

//TODO extract these
interface FormHeaderProps {
  children: React.ReactNode;
}

export const FormHeader = ({ children }: FormHeaderProps) => (
  <Typography component="h4" variant="h5" align={'left'}>
    {children}
  </Typography>
);

interface FormControlProps {
  half?: boolean;
  children: React.ReactNode;
}

// FIXME i think i'm using way too much grid here. Can this be simplified?
const FormControl = ({ half = false, children }: FormControlProps) => {
  let lg: GridSize = 12;
  if (half) {
    lg = 6;
  }
  return (
    <Grid container={true}>
      <Grid item={true} xs={12} lg={lg}>
        {children}
      </Grid>
    </Grid>
  );
};

interface NavigatorProps extends RouteComponentProps {
  projects: number[];
  invoices: number[];
  id?: number;
}

const Navigator = withRouter(({ projects, invoices, id, history }: NavigatorProps) => (
  <Tabs value={0}>
    <Tab label={`Offerte ${id}`} />
    {projects.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
    ))}
    {invoices.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
  </Tabs>
));

const schema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  description: yup.string(),
  fixed_price: yup.boolean(),
  rate_group_id: yup.number().required(),
  short_description: yup.string(),
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
  offer: Offer;
}

@compose(
  inject('mainStore'),
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
                <Grid item xs={12}>
                  {offer.id && <Navigator projects={offer.project_ids} invoices={offer.invoice_ids} id={offer.id} />}
                  <DimePaper>
                    <FormControl half>
                      <Field fullWidth component={TextField} name={'name'} label={'Name'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={AddressSelector} name={'address_id'} label={'Kunde'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={StatusSelector} name={'status'} label={'Status'} />
                    </FormControl>
                    <FormControl half>
                      <Field component={EmployeeSelector} name={'accountant_id'} label={'Verantwortlicher Mitarbeiter'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={TextField} name={'short_description'} label={'Kurzbeschreibung'} />
                    </FormControl>
                    <FormControl>
                      <Field fullWidth component={MarkdownField} multiline rowsMax={14} name={'description'} label={'Beschreibung'} />
                    </FormControl>
                  </DimePaper>
                </Grid>

                <Grid item xs={12}>
                  <DimePaper>
                    <OfferPositionSubform formikProps={props} mainStore={this.props.mainStore} name={'positions'} />
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
