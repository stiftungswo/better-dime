import { Table, TableBody, TableHead, TableRow, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import {Warning} from '@mui/icons-material';
import { FieldArray, FormikProps, getIn } from 'formik';
import { Observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { NumberField, SwitchField } from '../../form/fields/common';
import { DatePicker, DatePickerUnpadded } from '../../form/fields/DatePicker';
import { DurationField } from '../../form/fields/DurationField';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import { Employee, WorkPeriod } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

const template = {
  ending: moment().endOf('year'),
  formikKey: Math.random(),
  pensum: 100,
  beginning: moment().startOf('year'),
  vacation_takeover: 0,
  yearly_vacation_budget: 10080,
  hourly_paid: false,
};

interface Props {
  disabled?: boolean;
  formikProps: FormikProps<Employee>;
  name: string;
  yearly_vacation_budget: number | null;
  intl?: IntlShape;
}
@compose(
  injectIntl,
)
export class WorkPeriodSubform extends React.Component<Props> {
  render() {
    const { yearly_vacation_budget } = this.props;
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const currentError = getIn(touched, name) && getIn(errors, name);
    const idPrefix = 'view.employee.work_period_subform';
    const intlText = wrapIntl(this.props.intl!, idPrefix);

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
                  title={intlText('work_period')}
                  error={Boolean(currentError)}
                  addAction={disabled ? undefined : () => arrayHelpers.push(templateVals)}
                />

                <Table style={{ minWidth: '1300px' }}>
                  <TableHead>
                    <TableRow>
                      <DimeTableCell style={{ width: '17%' }}> <FormattedMessage id={idPrefix + '.start'} /> </DimeTableCell>
                      <DimeTableCell style={{ width: '17%' }}> <FormattedMessage id={idPrefix + '.end'} /> </DimeTableCell>
                      <DimeTableCell style={{ width: '8%' }}> <FormattedMessage id={idPrefix + '.pensum'} /> </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={intlText('target_time.tooltip')}
                        >
                          <p> <FormattedMessage id={idPrefix + '.target_time'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={intlText('effective_time.tooltip')}
                        >
                          <p> <FormattedMessage id={idPrefix + '.effective_time'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={intlText('effort_until_today.tooltip')}
                        >
                          <p> <FormattedMessage id={idPrefix + '.effort_until_today'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip
                          title={intlText('vacation_budget.tooltip')}
                        >
                          <p> <FormattedMessage id={idPrefix + '.vacation_budget'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '7%' }}>
                        <Tooltip title={intlText('remaining_vacation_budget.tooltip')}>
                          <p> <FormattedMessage id={idPrefix + '.remaining_vacation_budget'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '11%' }}>
                        <Tooltip
                          title={intlText('vacation_takeover.tooltip')}
                        >
                          <p> <FormattedMessage id={idPrefix + '.vacation_takeover'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '8%' }}>
                        <Tooltip title={intlText('yearly_vacation_budget.tooltip')}>
                          <p> <FormattedMessage id={idPrefix + '.yearly_vacation_budget'} /> </p>
                        </Tooltip>
                      </DimeTableCell>
                      <DimeTableCell style={{ width: '4%' }}> <FormattedMessage id={idPrefix + '.hourly_pay'} /> </DimeTableCell>
                      <DimeTableCell style={{ width: '4%' }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.work_periods.sort((a: WorkPeriod, b: WorkPeriod) => {
                      const datesAreOnSameDay = (first: Date, second: Date) =>
                        first.getFullYear() === second.getFullYear() &&
                        first.getMonth() === second.getMonth() &&
                        first.getDate() === second.getDate();

                      const startA = new Date(a.beginning);
                      const startB = new Date(b.beginning);
                      const endA = new Date(a.ending);
                      const endB = new Date(b.ending);

                      if (!datesAreOnSameDay(startA, startB)) { // if the difference is more than 23.99 hours
                        return startA.getTime() - startB.getTime();
                      } else {
                        return endA.getTime() - endB.getTime();
                      }
                    }).map((w: WorkPeriod & { formikKey?: number }, index: number) => {
                      const formattedHours = (value: number): string => (isNaN(value) ? '-' : (value / 60).toFixed(1) + 'h');
                      const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                      const rowColor = w.overlapping_periods ? 'rgb(255, 222, 219)' : 'none';
                      const border = w.overlapping_periods ? 'solid 2px rgb(255, 222, 219)' : 'none';

                      return (
                        <TableRow key={w.id || w.formikKey}>
                          {w.overlapping_periods && (
                            <DimeTableCell style={{paddingLeft: '0px'}}>
                              <Grid
                                container
                                direction="row"
                                alignItems="center"
                                style={{paddingBottom: '5px', flexWrap: 'nowrap'}}
                              >
                                <Grid item>
                                  <Warning color={'error'}/>
                                </Grid>
                                <Grid item style={{color: 'red', marginLeft: '10px'}}>
                                  <DimeDatePickerField component={DatePicker} name={fieldName('beginning')} />
                                </Grid>
                              </Grid>
                            </DimeTableCell>
                          )}
                          {!w.overlapping_periods && (
                            <DimeTableCell>
                              <DimeDatePickerField component={DatePickerUnpadded} name={fieldName('beginning')} />
                            </DimeTableCell>
                          )}
                          <DimeTableCell>
                            <DimeDatePickerField component={DatePickerUnpadded} name={fieldName('ending')} />
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
                            {formattedHours(w.vacation_takeover)}
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField
                              delayed
                              component={DurationField}
                              timeUnit={'workday'}
                              name={fieldName('yearly_vacation_budget')}
                            />
                          </DimeTableCell>
                          <DimeTableCell>
                            <DimeField
                              delayed
                              component={SwitchField}
                              name={fieldName('hourly_paid')}
                            />
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
          </Observer>
        )}
      />
    );
  }
}
