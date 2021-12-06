import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DimePaper } from '../../layout/DimePaper';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';

const useStyles = makeStyles((theme: Theme) => createStyles({
  tablecell: {
    body: {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

interface Props {
  mainStore?: MainStore;
  moneyBudget: number;
  moneyUsed: number;
  timeBudget: number;
  timeUsed: number;
}

export const ProjectStatTable = compose(
  inject('mainStore'),
  observer,
) ((props: Props) => {
  const { mainStore, moneyBudget, moneyUsed, timeBudget, timeUsed } = props;
  const classes = useStyles();

  return (
    <DimePaper>
      <TableToolbar title={moneyBudget || timeBudget ? 'Restbudget' : 'Projekt Statistik'} />

      <Table>
        <TableBody>
          {moneyBudget && (
            <TableRow>
              <TableCell>Geldbudget</TableCell>
              <TableCell>{mainStore!.formatCurrency(moneyBudget)}</TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Geld verwendet</TableCell>
            <TableCell style={{ color: moneyBudget ? (moneyBudget > moneyUsed ? 'green' : 'red') : 'gray' }}>
              {mainStore!.formatCurrency(moneyUsed)}
            </TableCell>
          </TableRow>

          {timeBudget && (
            <TableRow>
              <TableCell>Zeitbudget</TableCell>
              <TableCell>{mainStore!.formatDuration(timeBudget, 'h', true)}</TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Zeit verwendet</TableCell>
            <TableCell style={{ color: timeBudget ? (timeBudget > timeUsed ? 'green' : 'red') : 'gray'}}>
              {mainStore!.formatDuration(timeUsed, 'h', true)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DimePaper>
  );
});
