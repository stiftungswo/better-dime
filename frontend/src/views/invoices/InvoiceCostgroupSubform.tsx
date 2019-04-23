import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { FieldArray, FormikProps, getIn } from 'formik';
import { observer } from 'mobx-react';
import * as React from 'react';
import CostgroupSelect from '../../form/entitySelect/CostgroupSelect';
import { NumberField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { ErrorText } from '../../layout/ErrorText';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Invoice, InvoiceCostgroup } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  costgroup_number: '',
  formikKey: Math.random(),
  weight: 100,
});

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

  render() {
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
              addAction={disabled ? undefined : () => arrayHelpers.push(template())}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '20%' }}>Gewicht</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Anteil</DimeTableCell>
                  <DimeTableCell style={{ width: '50%' }}>Kostenstelle</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {typeof currentError === 'string' && (
                  <TableRow>
                    <DimeTableCell colSpan={4}>
                      <ErrorText>{currentError}</ErrorText>
                    </DimeTableCell>
                  </TableRow>
                )}
                {values.costgroup_distributions.map((p: InvoiceCostgroup & { formikKey?: number }, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  const distribution = ((p.weight / weightSum) * 100).toFixed(0);
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={fieldName('weight')} />
                      </DimeTableCell>
                      <DimeTableCell>{distribution}%</DimeTableCell>
                      <DimeTableCell>
                        <DimeField portal component={CostgroupSelect} name={fieldName('costgroup_number')} />
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
