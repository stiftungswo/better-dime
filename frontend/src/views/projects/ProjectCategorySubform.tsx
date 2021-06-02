import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { FieldArray, FormikProps, getIn } from 'formik';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ProjectCategorySelect } from '../../form/entitySelect/ProjectCategorySelect';
import { NumberField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { ErrorText } from '../../layout/ErrorText';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Project, ProjectCategory } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  category_id: '',
  formikKey: Math.random(),
  weight: 100,
});

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Project>;
  name: string;
  disabled?: boolean;
}

@compose(observer)
export class ProjectCategorySubform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const weightSum = values.category_distributions.map(d => d.weight).reduce((a: number, b: number) => a + b, 0);
    const currentError = getIn(touched, name) && getIn(errors, name);
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={'Tätigkeitsbereiche'}
              error={Boolean(currentError)}
              addAction={disabled ? undefined : () => arrayHelpers.push(template())}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '20%' }}>Gewicht</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Anteil</DimeTableCell>
                  <DimeTableCell style={{ width: '50%' }}>Tätigkeitsbereich</DimeTableCell>
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
                {values.category_distributions.map((p: ProjectCategory & { formikKey?: number }, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  const distribution = ((p.weight / weightSum) * 100).toFixed(0);
                  return (
                    <TableRow key={p.category_id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={fieldName('weight')} />
                      </DimeTableCell>
                      <DimeTableCell>{distribution}%</DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={ProjectCategorySelect} name={fieldName('category_id')} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <ConfirmationButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
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
