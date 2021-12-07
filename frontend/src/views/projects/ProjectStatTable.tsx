import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { styled, Theme } from '@material-ui/core/styles';
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
const PaddedTableCell = styled(TableCell)(({theme}) => ({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(7)}px ${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
}), {withTheme: true});

export const ProjectStatTable = compose(
  inject('mainStore'),
  observer,
) ((props: Props) => {
  const { mainStore, moneyBudget, moneyUsed, timeBudget, timeUsed } = props;

  return (
    <DimePaper>
      <TableToolbar title={moneyBudget || timeBudget ? 'Restbudget' : 'Projekt Statistik'} />

      <Table>
        <TableBody>
          {moneyBudget && (
            <TableRow>
              <PaddedTableCell>Geldbudget</PaddedTableCell>
              <PaddedTableCell>{mainStore!.formatCurrency(moneyBudget)}</PaddedTableCell>
            </TableRow>
          )}

          <TableRow>
            <PaddedTableCell>Geld verwendet</PaddedTableCell>
            <PaddedTableCell style={{ color: moneyBudget ? (moneyBudget > moneyUsed ? 'green' : 'red') : 'gray' }}>
              {mainStore!.formatCurrency(moneyUsed)}
            </PaddedTableCell>
          </TableRow>

          {timeBudget && (
            <TableRow>
              <PaddedTableCell>Zeitbudget</PaddedTableCell>
              <PaddedTableCell>{mainStore!.formatDuration(timeBudget, 'h', true)}</PaddedTableCell>
            </TableRow>
          )}

          <TableRow>
            <PaddedTableCell>Zeit verwendet</PaddedTableCell>
            <PaddedTableCell style={{ color: timeBudget ? (timeBudget > timeUsed ? 'green' : 'red') : 'gray'}}>
              {mainStore!.formatDuration(timeUsed, 'h', true)}
            </PaddedTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DimePaper>
  );
});
