import { Dialog, makeStyles } from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog';
import * as React from 'react';

const useStyles = makeStyles({
  root: {
    overflow: 'visible',
  },
});

export default function DimeDialog(props: DialogProps) {
  const classes = useStyles(props);
  return <Dialog className={classes.root} {...props}>{props.children}</Dialog>;
}
