import compose from '../utilities/compose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography/Typography';
import { FormHeader } from './FormHeader';
import { DeleteButton } from './ConfirmationDialog';
import { ActionButton, ActionButtonAction } from './ActionButton';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const toolbarStyles = (theme: any) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

interface EnhancedTableToolbarProps extends WithStyles<typeof toolbarStyles> {
  numSelected?: number;
  deleteAction?: any;
  addAction?: ActionButtonAction;
  title: string;
  children?: React.ReactNode;
}

const TableToolbar = compose(withStyles(toolbarStyles))((props: EnhancedTableToolbarProps) => {
  const { numSelected = 0, classes, deleteAction, addAction, title } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} ausgewählt
          </Typography>
        ) : (
          <FormHeader>{title}</FormHeader>
        )}
      </div>
      <div className={classes.spacer} />
      {props.children}
      <div className={classes.actions}>
        {numSelected > 0 ? <DeleteButton onConfirm={deleteAction} /> : addAction && <ActionButton icon={AddIcon} action={addAction} />}
      </div>
    </Toolbar>
  );
});

export default TableToolbar;
