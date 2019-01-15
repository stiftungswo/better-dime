import * as React from 'react';
import { FieldArray, FormikProps } from 'formik';
import { SwitchField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Invoice, InvoiceDiscount } from '../../types';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DimeField } from '../../form/fields/formik';

const template = () => ({
  formikKey: Math.random(),
  name: '',
  percentage: false,
  value: 0,
});

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Invoice>;
  name: string;
  disabled?: boolean;
}

@compose(observer)
export default class InvoiceDiscountSubform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { values } = this.props.formikProps;
    const { disabled } = this.props;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Abzüge'} numSelected={0} addAction={disabled ? undefined : () => arrayHelpers.push(template())} />
            <Table>
              <TableHead>
                <TableRow>
                  <DimeTableCell>Name</DimeTableCell>
                  <DimeTableCell>Prozent</DimeTableCell>
                  <DimeTableCell>Abzug</DimeTableCell>
                  <DimeTableCell>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.discounts.map((p: InvoiceDiscount & { formikKey?: number }, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('name')} disabled={disabled} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={SwitchField} name={name('percentage')} disabled={disabled} />
                      </DimeTableCell>
                      <DimeTableCell>
                        {p.percentage ? (
                          <DimeField delayed component={PercentageField} unit={'%'} name={name('value')} disabled={disabled} />
                        ) : (
                          <DimeField delayed component={CurrencyField} name={name('value')} disabled={disabled} />
                        )}
                      </DimeTableCell>
                      <DimeTableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                      </DimeTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      />
    );
  }
}
