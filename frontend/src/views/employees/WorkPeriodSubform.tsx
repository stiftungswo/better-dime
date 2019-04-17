import { Table, TableBody, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { FieldArray, FormikProps, getIn } from 'formik';
import { Observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { NumberField } from '../../form/fields/common';
import { DatePicker } from '../../form/fields/DatePicker';
import { DurationField } from '../../form/fields/DurationField';
import { DimeField } from '../../form/fields/formik';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import { Employee, WorkPeriod } from '../../types';

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
  yearly_vacation_budget: number | null;
}

export class WorkPeriodSubform extends React.Component<Props> {
  render() {
    const { yearly_vacation_budget } = this.props;
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const currentError = getIn(touched, name) && getIn(errors, name);

    const templateVals = {
      ...template,
      yearly_vacation_budget: yearly_vacation_budget ? yearly_vacation_budget * 504 : template.yearly_vacation_budget,
    };

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
                  addAction={disabled ? undefined : () => arrayHelpers.push(templateVals)}
                />

                <Table style={{ minWidth: '1300px' }}>
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
                        <Tooltip title={'Das unverbuchte Guthaben an Ferienstunden.'}>
                          <p>Restliches Ferienguthaben</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '11%' }}>
                        <Tooltip
                          title={'Der Übertrag rechnet sich aus der Zahl im "Heute"-Feld addiert mit dem restlichen Ferienguthaben.'}
                        >
                          <p>Übertrag</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '8%' }}>
                        <Tooltip title={'Das jährliche Ferienbudget ist immer auf ein 100% zu verstehen.'}>
                          <p>Jährliches Ferienbudget</p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '8%' }}>Aktionen</DimeTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.work_periods.map((w: WorkPeriod & { formikKey?: number }, index: number) => {
                      const formattedHours = (value: number): string => (isNaN(value) ? '-' : (value / 60).toFixed(1) + 'h');
                      const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;

                      return (
                        <TableRow key={w.id || w.formikKey}>
                          <DimeTableCell>
                            <DimeField component={DatePicker} name={fieldName('start')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField component={DatePicker} name={fieldName('end')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField delayed component={NumberField} name={fieldName('pensum')} endAdornment={'%'} />
                          </DimeTableCell>
                          <DimeTableCell>{formattedHours(w.target_time)}</DimeTableCell>
                          <DimeTableCell>{formattedHours(w.effective_time)}</DimeTableCell>
                          <DimeTableCell style={{ color: w.effort_till_today < 0 ? 'red' : 'green' }}>
                            {formattedHours(w.effort_till_today)}
                          </DimeTableCell>
                          <DimeTableCell>{formattedHours(w.period_vacation_budget)}</DimeTableCell>
                          <DimeTableCell style={{ color: w.remaining_vacation_budget < 0 ? 'red' : 'green' }}>
                            {formattedHours(w.remaining_vacation_budget)}
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField delayed component={DurationField} timeUnit={'hour'} name={fieldName('vacation_takeover')} />
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField delayed component={DurationField} timeUnit={'workday'} name={fieldName('yearly_vacation_budget')} />
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
