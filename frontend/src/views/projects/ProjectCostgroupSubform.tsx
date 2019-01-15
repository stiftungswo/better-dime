import * as React from 'react';
import { FieldArray, FormikProps, getIn } from 'formik';
import { NumberField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Invoice, InvoiceCostgroup, Project, ProjectCostgroup } from '../../types';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import CostgroupSelector from '../../form/entitySelector/CostgroupSelector';
import { ErrorText } from '../../layout/ErrorText';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DimeField } from '../../form/fields/formik';

const template = () => ({
  costgroup_number: 0,
  formikKey: Math.random(),
  weight: 10,
});

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Project>;
  name: string;
  disabled?: boolean;
}

@compose(observer)
export class ProjectCostgroupSubform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const weightSum = values.costgroup_distributions.map(d => d.weight).reduce((a: number, b: number) => a + b, 0);
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
                {values.costgroup_distributions.map((p: ProjectCostgroup & { formikKey?: number }, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  const distribution = ((p.weight / weightSum) * 100).toFixed(0);
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={fieldName('weight')} />
                      </DimeTableCell>
                      <DimeTableCell>{distribution}%</DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={CostgroupSelector} name={fieldName('costgroup_number')} />
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
