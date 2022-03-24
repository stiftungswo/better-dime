import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DailyReportEffort, DailyReportStore } from '../../stores/dailyReportStore';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  dailyReportStore?: DailyReportStore;
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('dailyReportStore', 'mainStore'),
  observer,
)
export default class DailyReport extends React.Component<Props> {
  render() {
    const dailyReportStore = this.props.dailyReportStore!;
    const { dates, employees } = dailyReportStore.result;
    const { detail } = dailyReportStore;
    const intlText = wrapIntl(this.props.intl!, 'view.report.daily');
    return (
      <>
        <DimeAppBar title={intlText('layout.navigation.reports.daily', true)} />
        <DimeContent paper={false}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DimePaper>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <DateSpanPicker
                      fromValue={dailyReportStore.from}
                      onChangeFrom={d => (dailyReportStore.from = d!)}
                      toValue={dailyReportStore.to}
                      onChangeTo={d => (dailyReportStore.to = d!)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={dailyReportStore.fetch} color={'primary'} variant="contained">
                      <FormattedMessage id="general.action.fetch" />
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
                  intlText('no_results')
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
  }
}
