import * as React from 'react';
import { DimeAppBar } from '../layout/DimeAppBar';
import { DimeContent, DimePaper } from '../layout/DimeLayout';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { DailyReportEffort, DailyReportStore } from '../stores/dailyReportStore';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import { MainStore } from '../stores/mainStore';
import Grid from '@material-ui/core/Grid/Grid';
import { formikFieldCompatible } from '../form/fields/Select';
import { DatePicker } from '../form/fields/DatePicker';
import Button from '@material-ui/core/Button/Button';

interface Props {
  dailyReportStore?: DailyReportStore;
  mainStore?: MainStore;
}

@compose(
  inject('dailyReportStore', 'mainStore'),
  observer
)
export default class DailyReport extends React.Component<Props> {
  render() {
    const dailyReportStore = this.props.dailyReportStore!;
    const { dates, employees } = dailyReportStore.result;
    return (
      <>
        <DimeAppBar title={'Wochenrapport'} />
        <DimeContent paper={false}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <DimePaper>
                <Grid container spacing={8}>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      fullWidth
                      {...formikFieldCompatible({
                        label: 'Von',
                        value: dailyReportStore.from,
                        onChange: d => (dailyReportStore.from = d),
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      fullWidth
                      {...formikFieldCompatible({
                        label: 'Bis',
                        value: dailyReportStore.to,
                        onChange: d => (dailyReportStore.to = d),
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={dailyReportStore.fetch} color={'primary'} variant="contained">
                      Laden
                    </Button>
                  </Grid>
                </Grid>
              </DimePaper>
            </Grid>
            <Grid item xs={12}>
              <DimePaper>
                {employees.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        {dates.map(date => (
                          <TableCell key={date}>{this.props.mainStore!.formatDate(date)}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.map(employee => (
                        <TableRow key={employee.employee_id}>
                          <TableCell>{employee.name}</TableCell>
                          {dates.map(date => (
                            <TableCell key={date}>{this.renderCell(employee.efforts[date])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  'Keine Resultate'
                )}
              </DimePaper>
            </Grid>
          </Grid>
        </DimeContent>
      </>
    );
  }

  renderCell = (efforts?: DailyReportEffort[]) => {
    if (efforts === undefined) {
      return undefined;
    }

    //TODO add an onclick popup that breaks down each effort
    const sum = efforts.map(e => Number(e.value)).reduce((a, b) => a + b, 0);
    return this.props.mainStore!.formatDuration(sum, 'h', true);
  };
}
