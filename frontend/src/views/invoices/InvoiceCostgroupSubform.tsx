import * as React from 'react';
import { ErrorMessage, Field, FieldArray, FormikProps, getIn } from 'formik';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Invoice, InvoiceCostgroup, InvoiceDiscount } from '../../types';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import CostgroupSelector from '../../form/entitySelector/CostgroupSelector';
import { ErrorText } from '../../layout/ErrorText';

const template = {
  weight: 10,
  costgroup_number: '',
};

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Invoice>;
  name: string;
  disabled?: boolean;
}

@compose(observer)
export default class InvoiceCostgroupSubform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const weightSum = values.costgroup_distributions.map(d => d.weight).reduce((a, b) => a + b, 0);
    const currentError = getIn(touched, name) && getIn(errors, name);
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={'Kostenstellen'}
              error={Boolean(currentError)}
              addAction={disabled ? undefined : () => arrayHelpers.push(template)}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '20%' }}>Gewicht</TableCell>
                  <TableCell style={{ width: '15%' }}>Anteil</TableCell>
                  <TableCell style={{ width: '50%' }}>Kostenstelle</TableCell>
                  <TableCell style={{ width: '15%' }}>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {typeof currentError === 'string' && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <ErrorText>{currentError}</ErrorText>
                    </TableCell>
                  </TableRow>
                )}
                {values.costgroup_distributions.map((p: InvoiceCostgroup, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  const distribution = ((p.weight / weightSum) * 100).toFixed(0);
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Field delayed component={NumberField} name={fieldName('weight')} />
                      </TableCell>
                      <TableCell>{distribution}%</TableCell>
                      <TableCell>
                        <Field component={CostgroupSelector} name={fieldName('costgroup_number')} />
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
