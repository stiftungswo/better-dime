import * as React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Invoice, InvoicePosition } from '../../types';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { ServiceStore } from '../../stores/serviceStore';

const template = {
  amount: '',
  description: '',
  order: 100,
  vat: 0.077,
  rate_unit_id: '',
  price_per_rate: 0,
};

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  formikProps: FormikProps<Invoice>;
  name: string;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'serviceStore'),
  observer
)
export default class InvoicePositionSubformInline extends React.Component<Props> {
  public render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Rechnungsposten'} addAction={() => arrayHelpers.push(template)} />
            <div style={{ overflowX: 'auto' }}>
              <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '5%' }}>Sort.</TableCell>
                    <TableCell style={{ width: '25%' }}>Beschreibung</TableCell>
                    <TableCell style={{ width: '15%' }}>Tarif</TableCell>
                    <TableCell style={{ width: '20%' }}>Tariftyp</TableCell>
                    <TableCell style={{ width: '10%' }}>Menge</TableCell>
                    <TableCell style={{ width: '10%' }}>MwSt.</TableCell>
                    <TableCell style={{ width: '10%' }}>Total CHF</TableCell>
                    <TableCell style={{ width: '10%' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.positions.map((p: InvoicePosition, index: number) => {
                    const name = <T extends keyof InvoicePosition>(fieldName: T) => `${this.props.name}.${index}.${fieldName}`;
                    const total = p.amount * p.price_per_rate * (1 + p.vat);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Field delayed component={NumberField} name={name('order')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed fullWidth component={TextField} name={name('description')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={NumberField} name={name('amount')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={PercentageField} name={name('vat')} margin={'none'} />
                        </TableCell>
                        <TableCell>{this.props.mainStore!.formatCurrency(total, false)}</TableCell>
                        <TableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      />
    );
  }
}
