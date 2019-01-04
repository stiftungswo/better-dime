import * as React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
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
import { DimeTableCell } from '../../layout/DimeTableCell';

const template = () => ({
  amount: 0,
  description: '',
  formikKey: Math.random(),
  order: 100,
  price_per_rate: 0,
  rate_unit_id: 0,
  vat: 0.077,
});

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Invoice>;
  name: string;
  disabled?: boolean;
}

@compose(
  inject('mainStore'),
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
            <TableToolbar title={'Rechnungsposten'} addAction={() => arrayHelpers.push(template())} />
            <div style={{ overflowX: 'auto' }}>
              <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                <TableHead>
                  <TableRow>
                    <DimeTableCell style={{ width: '5%' }}>Sort.</DimeTableCell>
                    <DimeTableCell style={{ width: '25%' }}>Beschreibung</DimeTableCell>
                    <DimeTableCell style={{ width: '15%' }}>Tarif</DimeTableCell>
                    <DimeTableCell style={{ width: '20%' }}>Tariftyp</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>Menge</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>MwSt.</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>Total CHF</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>Aktionen</DimeTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.positions.map((p: InvoicePosition & { formikKey?: number }, index: number) => {
                    const name = <T extends keyof InvoicePosition>(fieldName: T) => `${this.props.name}.${index}.${fieldName}`;
                    const total = p.amount * p.price_per_rate * (1 + p.vat);
                    return (
                      <TableRow key={p.id || p.formikKey}>
                        <DimeTableCell>
                          <Field delayed component={NumberField} name={name('order')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <Field delayed fullWidth component={TextField} name={name('description')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <Field delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <Field component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <Field delayed component={NumberField} name={name('amount')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <Field delayed component={PercentageField} name={name('vat')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                        <DimeTableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                        </DimeTableCell>
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
