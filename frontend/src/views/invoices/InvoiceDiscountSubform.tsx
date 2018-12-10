import * as React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
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

const template = {
  name: '',
  percentage: false,
  value: 0,
};

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
            <TableToolbar title={'Abzüge'} numSelected={0} addAction={disabled ? undefined : () => arrayHelpers.push(template)} />
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
                {values.discounts.map((p: InvoiceDiscount, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Field delayed component={TextField} name={name('name')} disabled={disabled} />
                      </TableCell>
                      <TableCell>
                        <Field component={SwitchField} name={name('percentage')} disabled={disabled} />
                      </TableCell>
                      <TableCell>
                        {p.percentage ? (
                          <Field delayed component={PercentageField} unit={'%'} name={name('value')} disabled={disabled} />
                        ) : (
                          <Field delayed component={CurrencyField} name={name('value')} disabled={disabled} />
                        )}
                      </TableCell>
                      <TableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                      </TableCell>
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
