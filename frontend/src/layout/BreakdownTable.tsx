import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import { Breakdown } from '../types';
import compose from '../utilities/compose';
import { DimeTableCell } from './DimeTableCell';

interface BTProps {
  mainStore?: MainStore;
  breakdown: Breakdown;
  fixedPrice?: number | null;
}

@compose(
  inject('mainStore'),
  observer,
)
export class BreakdownTable extends React.Component<BTProps> {
  render() {
    const format = (amount: number) => this.props.mainStore!.formatCurrency(amount, true);
    const { subtotal, vatTotal, discountTotal, total } = this.props.breakdown;

    // if (this.props.fixedPrice && this.props.fixedPrice > 0) {
    //   total = this.props.fixedPrice;
    //   subtotal = total / 1.077;
    //   vatTotal = total - subtotal;
    //   discountTotal = 0;
    // }

    return (
      <Table>
        <TableBody>
          <TableRow>
            <DimeTableCell>Subtotal</DimeTableCell>
            <DimeTableCell numeric>{format(subtotal)}</DimeTableCell>
          </TableRow>
          <TableRow>
            <DimeTableCell>MwSt.</DimeTableCell>
            <DimeTableCell numeric>{format(vatTotal)}</DimeTableCell>
          </TableRow>
          <TableRow>
            <DimeTableCell>Total Abzüge</DimeTableCell>
            <DimeTableCell numeric>{format(discountTotal)}</DimeTableCell>
          </TableRow>
          <TableRow>
            <DimeTableCell>Total</DimeTableCell>
            <DimeTableCell numeric>{format(total)}</DimeTableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}
