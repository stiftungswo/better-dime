import React from 'react';
import { Employee, WorkPeriod } from '../../types';
import { Field, FieldArray, FormikProps, getIn } from 'formik';
import TableToolbar from '../../layout/TableToolbar';
import moment from 'moment';
import { Table, TableBody, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { DatePicker } from '../../form/fields/DatePicker';
import { NumberField } from '../../form/fields/common';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DurationField } from '../../form/fields/DurationField';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { Observer } from 'mobx-react';

const template = {
  end: moment().endOf('year'),
  formikKey: Math.random(),
  pensum: 100,
  start: moment().startOf('year'),
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
          <Observer>
            {() => (
              <>
                <TableToolbar
                  title={'Arbeitsperioden'}
                  error={Boolean(currentError)}
                  addAction={disabled ? undefined : () => arrayHelpers.push(template)}
                />

                <Table style={{ minWidth: '1200px' }}>
                  <TableHead>
                    <TableRow>
                      <DimeTableCell style={{ width: '15%' }}>Start</DimeTableCell>
                      <DimeTableCell style={{ width: '15%' }}>Ende</DimeTableCell>
                      <DimeTableCell style={{ width: '8%' }}>Pensum</DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Die Sollzeit sind die zu leistenden Arbeitsstunden basierend auf dem gewählten Start- und Enddatum addiert mit dem Ferienguthaben für diese Periode. Öffentliche Feiertage werden abgezogen.'
                          }
                        >
                          <p>Sollzeit</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Die Istzeit wird direkt aus der Zeiterfassung berechnet und umfasst alle Zeiteinträge, welche auf diese Person innerhalb des gewählten Start- und Enddatum bei der Periode gebucht wurden.'
                          }
                        >
                          <p>Istzeit</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Gebuchte Stunden innerhalb der Periode bis heute (oder falls das Enddatum vor dem heutigen Datum liegt, bis zum Enddatum).'
                          }
                        >
                          <p>Heute</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Guthaben für Ferien in Stunden. Dies wird anteilsmässig aus dem jährlichen Ferienbudget berechnet. Dazu gezählt wird der Ferienübertrag.'
                          }
                        >
                          <p>Ferienguthaben</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip title={'Stunden, welche innerhalb dieser Periode auf ein Ferienprojekt gebucht wurden.'}>
                          <p>Ferien gebucht</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '9%' }}>Übertrag</DimeTableCell>
                      <DimeTableCell style={{ width: '9%' }}>Jährliches Ferienbudget</DimeTableCell>
                      <DimeTableCell style={{ width: '9%' }}>Aktionen</DimeTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.work_periods.map((w: WorkPeriod & { formikKey?: number }, index: number) => {
                      const formattedHours = (value: number): string => (isNaN(value) ? '-' : (value / 60).toFixed(1) + 'h');
                      const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;

                      return (
                        <TableRow key={w.id || w.formikKey}>
                          <DimeTableCell>
                            <Field component={DatePicker} name={fieldName('start')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <Field component={DatePicker} name={fieldName('end')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <Field delayed component={NumberField} name={fieldName('pensum')} endAdornment={'%'} />
                          </DimeTableCell>
                          <DimeTableCell>{formattedHours(w.target_time)}</DimeTableCell>
                          <DimeTableCell>{formattedHours(w.effective_time)}</DimeTableCell>
                          <DimeTableCell style={{ color: w.effort_till_today < 0 ? 'red' : 'green' }}>
                            {formattedHours(w.effort_till_today)}
                          </DimeTableCell>
                          <DimeTableCell>{formattedHours(w.period_vacation_budget)}</DimeTableCell>
                          <DimeTableCell>{formattedHours(w.vacation_till_today)}</DimeTableCell>
                          <DimeTableCell>
                            <Field delayed component={DurationField} timeUnit={'hour'} name={fieldName('vacation_takeover')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <Field delayed component={DurationField} timeUnit={'workday'} name={fieldName('yearly_vacation_budget')} />
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
          </Observer>
        )}
      />
    );
  }
}
