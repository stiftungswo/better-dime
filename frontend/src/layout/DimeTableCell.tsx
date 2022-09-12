import { TableCell } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
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
