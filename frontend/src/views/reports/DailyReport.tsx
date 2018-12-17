import * as React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimePaper } from '../../layout/DimePaper';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { DailyReportEffort, DailyReportStore } from '../../stores/dailyReportStore';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableBody from '@material-ui/core/TableBody/TableBody';
import { MainStore } from '../../stores/mainStore';
import Grid from '@material-ui/core/Grid/Grid';
import { formikFieldCompatible } from '../../form/fields/Select';
import { DatePicker } from '../../form/fields/DatePicker';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import { DimeContent } from '../../layout/DimeContent';
import { DimeTableCell } from '../../layout/DimeTableCell';

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
    const { detail } = dailyReportStore;
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
                        <DimeTableCell />
                        {dates.map(date => (
                          <DimeTableCell key={date}>{this.props.mainStore!.formatDate(date)}</DimeTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees.map(employee => (
                        <TableRow key={employee.employee_id}>
                          <DimeTableCell>{employee.name}</DimeTableCell>
                          {dates.map(date => this.renderCell(employee.efforts[date], date))}
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
        {detail !== undefined && (
          <Dialog open onClose={this.handleCloseDetail}>
            <DialogContent>
              <Table>
                {detail.map((e: DailyReportEffort, index: number) => (
                  <TableRow key={index}>
                    <DimeTableCell>{e.service_name}</DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatDuration(Number(e.value), 'h', true)}</DimeTableCell>
                  </TableRow>
                ))}
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDetail} color={'primary'}>
                Schliessen
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  handleCloseDetail = () => (this.props.dailyReportStore!.detail = undefined);

  renderCell = (efforts: DailyReportEffort[], key: string) => {
    if (efforts === undefined) {
      return <DimeTableCell key={key} />;
    }

    const sum = efforts.map(e => Number(e.value)).reduce((a, b) => a + b, 0);
    return (
      <DimeTableCell key={key} onClick={() => (this.props.dailyReportStore!.detail = efforts)} style={{ cursor: 'pointer' }}>
        {this.props.mainStore!.formatDuration(sum, 'h', true)}
      </DimeTableCell>
    );
  };
}
