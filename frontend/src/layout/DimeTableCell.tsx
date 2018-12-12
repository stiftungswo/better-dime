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

type DimeTableCellProps = {} & TableCellProps & WithStyles<typeof styles>;

export const DimeTableCell = compose(withStyles(styles))((props: DimeTableCellProps) => {
  const { classes, ...restProps } = props;

  return (
    <TableCell className={classes.tableCell} {...restProps}>
      {props.children}
    </TableCell>
  );
});
