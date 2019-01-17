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

type DimeTableCellProps = { numeric?: boolean } & TableCellProps & WithStyles<typeof styles>;

export const DimeTableCell = compose(withStyles(styles))((props: DimeTableCellProps) => {
  const { classes, numeric, ...restProps } = props;

  return (
    <TableCell className={classes.tableCell} align={numeric ? 'right' : 'left'} {...restProps}>
      {props.children}
    </TableCell>
  );
});
