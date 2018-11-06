import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberFieldWithValidation, SwitchField, TextFieldWithValidation, TodoField } from '../../form/fields/common';
import Grid, { GridSize } from '@material-ui/core/Grid/Grid';
import { DimePaper, hasContent } from '../../layout/DimeLayout';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Offer, OfferPosition } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import OfferPositionSubform from './OfferPositionSubform';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { StatusSelector } from '../../form/entitySelector/StatusSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';

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
                    <FormHeader>Abzüge</FormHeader>
                    <FieldArray
                      name="discounts"
                      render={arrayHelpers => (
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Prozent</TableCell>
                              <TableCell>Abzug</TableCell>
                              <TableCell>Aktionen</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.values.discounts.map((p: OfferPosition, index: number) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Field component={TextFieldWithValidation} name={`discounts.${index}.name`} />
                                  </TableCell>
                                  <TableCell>
                                    <Field component={SwitchField} name={`discounts.${index}.percentage`} />
                                  </TableCell>
                                  <TableCell>
                                    <Field component={TodoField} name={`discounts.${index}.value`} />
                                  </TableCell>
                                  <TableCell>...</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    />
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
