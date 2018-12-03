import React from 'react';
import { createStyles, TableCell, WithStyles, withStyles } from '@material-ui/core';
import compose from '../utilities/compose';
import { TableCellProps } from '@material-ui/core/TableCell';

const styles = () =>
  createStyles({
    tableCell: {
      padding: '4px 12px 4px 24px',
    },
  });

type LessPaddingTableCellProps = {} & TableCellProps & WithStyles<typeof styles>;

export const LessPaddingTableCell = compose(withStyles(styles))((props: LessPaddingTableCellProps) => (
  <TableCell className={props.classes.tableCell} style={props.style}>
    {props.children}
  </TableCell>
));
