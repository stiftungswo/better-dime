import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DimePaper } from '../../layout/DimePaper';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';

interface Props {
  mainStore?: MainStore;
  moneyBudget: number;
  moneyUsed: number;
  timeBudget: number;
  timeUsed: number;
}

@compose(
  inject('mainStore'),
  observer,
)
export class ProjectBudgetTable extends React.Component<Props> {
  render() {
    const { mainStore, moneyBudget, moneyUsed, timeBudget, timeUsed } = this.props;

    return (
      <DimePaper>
        <TableToolbar title={'Restbudget'} />

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Geldbudget</TableCell>
              <TableCell>{mainStore!.formatCurrency(moneyBudget)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Geld verwendet</TableCell>
              <TableCell style={{ color: moneyBudget > moneyUsed ? 'green' : 'red' }}>{mainStore!.formatCurrency(moneyUsed)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Zeitbudget</TableCell>
              <TableCell>{mainStore!.formatDuration(timeBudget, 'h', true)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Zeit verwendet</TableCell>
              <TableCell style={{ color: timeBudget > timeUsed ? 'green' : 'red' }}>
                {mainStore!.formatDuration(timeUsed, 'h', true)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DimePaper>
    );
  }
}
