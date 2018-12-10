import React from 'react';
import { Employee, WorkPeriod } from '../../types';
import { Field, FieldArray, FormikProps, getIn } from 'formik';
import TableToolbar from '../../layout/TableToolbar';
import moment from 'moment';
import { Table, TableBody, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { DatePicker } from '../../form/fields/DatePicker';
import { NumberField } from '../../form/fields/common';
import { LessPaddingTableCell } from '../../layout/LessPaddingTableCell';
import { DurationField } from '../../form/fields/DurationField';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { Observer } from 'mobx-react';

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
                      <LessPaddingTableCell style={{ width: '15%' }}>Start</LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '15%' }}>Ende</LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '8%' }}>Pensum</LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Die Sollzeit sind die zu leistenden Arbeitsstunden basierend auf dem gewählten Start- und Enddatum addiert mit dem Ferienguthaben für diese Periode. Öffentliche Feiertage werden abgezogen.'
                          }
                        >
                          <p>Sollzeit</p>
                        </Tooltip>
                      </LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Die Istzeit wird direkt aus der Zeiterfassung berechnet und umfasst alle Zeiteinträge, welche auf diese Person innerhalb des gewählten Start- und Enddatum bei der Periode gebucht wurden.'
                          }
                        >
                          <p>Istzeit</p>
                        </Tooltip>
                      </LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Gebuchte Stunden innerhalb der Periode bis heute (oder falls das Enddatum vor dem heutigen Datum liegt, bis zum Enddatum).'
                          }
                        >
                          <p>Heute</p>
                        </Tooltip>
                      </LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={
                            'Guthaben für Ferien in Stunden. Dies wird anteilsmässig aus dem jährlichen Ferienbudget berechnet. Dazu gezählt wird der Ferienübertrag.'
                          }
                        >
                          <p>Ferienguthaben</p>
                        </Tooltip>
                      </LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '7%' }}>
                        <Tooltip title={'Stunden, welche innerhalb dieser Periode auf ein Ferienprojekt gebucht wurden.'}>
                          <p>Ferien gebucht</p>
                        </Tooltip>
                      </LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '9%' }}>Übertrag</LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '9%' }}>Jährliches Ferienbudget</LessPaddingTableCell>
                      <LessPaddingTableCell style={{ width: '9%' }}>Aktionen</LessPaddingTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.work_periods.map((w: WorkPeriod, index: number) => {
                      const formattedHours = (value: number): string => (isNaN(value) ? '-' : (value / 60).toFixed(1) + 'h');
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
                          <LessPaddingTableCell style={{ color: w.effort_till_today < 0 ? 'red' : 'green' }}>
                            {formattedHours(w.effort_till_today)}
                          </LessPaddingTableCell>
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
          </Observer>
        )}
      />
    );
  }
}
