import * as React from 'react';
import { FieldArray, FormikProps } from 'formik';
import { NumberField, TextField } from '../../form/fields/common';
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
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DragHandle } from '../../layout/icons';
import { DraggableTableBody } from './DraggableTableBody';
import { DimeField } from '../../form/fields/formik';

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
  public render = () => (
    <FieldArray
      name={this.props.name}
      render={arrayHelpers => (
        <>
          <TableToolbar title={'Rechnungsposten'} addAction={() => arrayHelpers.push(template())} />
          <div style={{ overflowX: 'auto' }}>
            <Table padding={'dense'} style={{ minWidth: '1200px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '5%' }} />
                  <DimeTableCell style={{ width: '25%' }}>Beschreibung</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Tarif</DimeTableCell>
                  <DimeTableCell style={{ width: '20%' }}>Tariftyp</DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}>Menge</DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}>MwSt.</DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}>Total CHF</DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <DraggableTableBody
                arrayHelpers={arrayHelpers}
                name={this.props.name}
                renderRow={({ row, index, provided }) => {
                  const p = row as InvoicePosition;
                  const name = <T extends keyof InvoicePosition>(fieldName: T) => `${this.props.name}.${index}.${fieldName}`;
                  const total = p.amount * p.price_per_rate * (1 + p.vat);
                  return (
                    <>
                      <DimeTableCell {...provided.dragHandleProps}>
                        <DragHandle />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('description')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={name('amount')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={PercentageField} name={name('vat')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                      <DimeTableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                      </DimeTableCell>
                    </>
                  );
                }}
              />
            </Table>
          </div>
        </>
      )}
    />
  );
}
