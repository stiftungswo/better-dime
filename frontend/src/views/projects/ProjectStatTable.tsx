import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { styled, Theme } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { DimePaper } from '../../layout/DimePaper';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

interface Props {
  mainStore?: MainStore;
  intl?: IntlShape;
  moneyBudget: number;
  moneyUsed: number;
  timeBudget: number;
  timeUsed: number;
}
const PaddedTableCell = styled(TableCell)(({theme}) => ({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(7)}px ${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
}), {withTheme: true});

export const ProjectStatTable = compose(
  injectIntl,
  inject('mainStore'),
  observer,
) ((props: Props) => {
  const { mainStore, moneyBudget, moneyUsed, timeBudget, timeUsed } = props;
  const idPrefix = 'view.project.stat_table';
  const intlText = wrapIntl(props.intl!, idPrefix);

  return (
    <DimePaper>
      <TableToolbar title={moneyBudget || timeBudget ? intlText('remaining_budget') : intlText('stats')} />

      <Table>
        <TableBody>
          {moneyBudget && (
            <TableRow>
              <PaddedTableCell> <FormattedMessage id={idPrefix + '.money_budget'} /> </PaddedTableCell>
              <PaddedTableCell>{mainStore!.formatCurrency(moneyBudget)}</PaddedTableCell>
            </TableRow>
          )}

          <TableRow>
            <PaddedTableCell> <FormattedMessage id={idPrefix + '.money_used'} /> </PaddedTableCell>
            <PaddedTableCell style={{ color: moneyBudget ? (moneyBudget > moneyUsed ? 'green' : 'red') : 'gray' }}>
              {mainStore!.formatCurrency(moneyUsed)}
            </PaddedTableCell>
          </TableRow>

          {timeBudget && (
            <TableRow>
              <PaddedTableCell> <FormattedMessage id={idPrefix + '.time_budget'} /> </PaddedTableCell>
              <PaddedTableCell>{mainStore!.formatDuration(timeBudget, 'h', true)}</PaddedTableCell>
            </TableRow>
          )}

          <TableRow>
            <PaddedTableCell> <FormattedMessage id={idPrefix + '.time_used'} /> </PaddedTableCell>
            <PaddedTableCell style={{ color: timeBudget ? (timeBudget > timeUsed ? 'green' : 'red') : 'gray'}}>
              {mainStore!.formatDuration(timeUsed, 'h', true)}
            </PaddedTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DimePaper>
  );
});
