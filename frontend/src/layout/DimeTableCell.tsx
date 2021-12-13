import { TableCell } from '@material-ui/core';
import { TableCellProps } from '@material-ui/core/TableCell';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import compose from '../utilities/compose';

const styles = () =>
  createStyles({
    tableCell: {
      padding: '4px 12px 4px 24px',
    },
  });

type DimeTableCellProps = { numeric?: boolean } & TableCellProps & WithStyles<typeof styles>;

export const DimeTableCell = compose(withStyles(styles))((props: DimeTableCellProps) => {
  const { classes, numeric, ...restProps } = props;

  return (
    <TableCell className={classes.tableCell} align={numeric ? 'right' : 'left'} {...restProps}>
      {props.children}
    </TableCell>
  );
});
