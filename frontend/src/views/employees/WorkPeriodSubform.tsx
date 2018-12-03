import React from 'react';
import { Employee, WorkPeriod } from '../../types';
import { Field, FieldArray, FormikProps, getIn } from 'formik';
import TableToolbar from '../../layout/TableToolbar';
import moment from 'moment';
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core';
import { DatePicker } from '../../form/fields/DatePicker';
import { NumberField } from '../../form/fields/common';
import { LessPaddingTableCell } from '../../layout/LessPaddingTableCell';
import { DurationField } from '../../form/fields/DurationField';
import { DeleteButton } from '../../layout/ConfirmationDialog';

const template = {
  end: moment(['year'])
    .endOf('year')
    .format('YYYY-MM-DD'),
  pensum: 100,
  start: moment(['year'])
    .startOf('year')
    .format('YYYY-MM-DD'),
  vacation_takeover: 0,
  yearly_vacation_budget: 10080,
};

interface Props {
  disabled?: boolean;
  formikProps: FormikProps<Employee>;
  name: string;
}

export class WorkPeriodSubform extends React.Component<Props> {
  public render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const currentError = getIn(touched, name) && getIn(errors, name);

    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={'Arbeitsperioden'}
              error={Boolean(currentError)}
              addAction={disabled ? undefined : () => arrayHelpers.push(template)}
            />

            <Table style={{ minWidth: '1200px' }}>
              <TableHead>
                <TableRow>
                  <LessPaddingTableCell style={{ width: '15%' }}>Start</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '15%' }}>Ende</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '8%' }}>Pensum</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '7%' }}>Sollzeit</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '7%' }}>Istzeit</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '7%' }}>Heute</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '7%' }}>Ferien total</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '7%' }}>Ferien gebucht</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '9%' }}>Übertrag</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '9%' }}>Jährliches Ferienbudget</LessPaddingTableCell>
                  <LessPaddingTableCell style={{ width: '9%' }}>Aktionen</LessPaddingTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.work_periods.map((w: WorkPeriod, index: number) => {
                  const formattedHours = (value: number): string => (isNaN(value) ? '-' : Math.floor(value / 60) + 'h');
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;

                  return (
                    <TableRow key={index}>
                      <LessPaddingTableCell>
                        <Field delayed component={DatePicker} name={fieldName('start')} />
                      </LessPaddingTableCell>
                      <LessPaddingTableCell>
                        <Field delayed component={DatePicker} name={fieldName('end')} />
                      </LessPaddingTableCell>
                      <LessPaddingTableCell>
                        <Field delayed component={NumberField} name={fieldName('pensum')} endAdornment={'%'} />
                      </LessPaddingTableCell>
                      <LessPaddingTableCell>{formattedHours(w.target_time)}</LessPaddingTableCell>
                      <LessPaddingTableCell>{formattedHours(w.effective_time)}</LessPaddingTableCell>
                      <LessPaddingTableCell>{formattedHours(w.effort_till_today)}</LessPaddingTableCell>
                      <LessPaddingTableCell>{formattedHours(w.period_vacation_budget)}</LessPaddingTableCell>
                      <LessPaddingTableCell>{formattedHours(w.vacation_till_today)}</LessPaddingTableCell>
                      <LessPaddingTableCell>
                        <Field delayed component={DurationField} name={fieldName('vacation_takeover')} />
                      </LessPaddingTableCell>
                      <LessPaddingTableCell>
                        <Field delayed component={DurationField} name={fieldName('yearly_vacation_budget')} />
                      </LessPaddingTableCell>
                      <LessPaddingTableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                      </LessPaddingTableCell>
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
