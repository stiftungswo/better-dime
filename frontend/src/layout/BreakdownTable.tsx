import { MainStore } from '../stores/mainStore';
import { Breakdown } from '../types';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';

interface BTProps {
  mainStore?: MainStore;
  breakdown: Breakdown;
}

@compose(
  inject('mainStore'),
  observer
)
export class BreakdownTable extends React.Component<BTProps> {
  render() {
    const format = (amount: number) => this.props.mainStore!.formatCurrency(amount, true);
    const { subtotal, vatTotal, discountTotal, total } = this.props.breakdown;

    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Subtotal</TableCell>
            <TableCell numeric>{format(subtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Davon MwSt.</TableCell>
            <TableCell numeric>{format(vatTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Abzüge</TableCell>
            <TableCell numeric>{format(discountTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell numeric>{format(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
