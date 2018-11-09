import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import { NumberFieldWithValidation, TextFieldWithValidation } from '../../form/fields/common';
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

//TODO extract these
export const FormHeader = ({ children }: any) => (
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
    {projects.map(id => (
      <Tab key={id} onClick={() => history.push(`/projects/${id}`)} label={`Projekt ${id}`} />
    ))}
    {invoices.map(id => (
      <Tab key={id} onClick={() => history.push(`/invoices/${id}`)} label={`Rechnung ${id}`} />
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
  offer: Offer | undefined;
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
    const { offer } = this.props;

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
              {/*TODO add projects/invoices to backend model*/}
              {offer && <Navigator projects={[]} invoices={[]} id={offer.id} />}
              <DimePaper>
                <FormControl half>
                  <Field fullWidth component={TextFieldWithValidation} name={'name'} label={'Name'} />
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
                  <Field fullWidth component={TextFieldWithValidation} name={'short_description'} label={'Kurzbeschreibung'} />
                </FormControl>
                <FormControl>
                  {/*TODO custom component with markdown preview*/}
                  <Field fullWidth component={TextFieldWithValidation} multiline rowsMax={14} name={'description'} label={'Beschreibung'} />
                </FormControl>
              </DimePaper>
              <DimePaper>
                <OfferPositionSubform formikProps={props} mainStore={this.props.mainStore} name={'positions'} />
              </DimePaper>

              {/*TODO fix spacing of papers*/}
              <Grid container={true}>
                <Grid item={true} xs={12} lg={6}>
                  <DimePaper>
                    <OfferDiscountSubform formikProps={props} name={'discounts'} />
                  </DimePaper>
                </Grid>
                <Grid item={true} xs={12} lg={6}>
                  <DimePaper>
                    <FormHeader>Berechnung</FormHeader>
                    <p>TODO</p>
                    <Field component={NumberFieldWithValidation} name={'fixed_price'} label={'Fixpreis'} />
                  </DimePaper>
                </Grid>
              </Grid>
            </form>
          </Fragment>
        )}
      />
    );
  }
}
