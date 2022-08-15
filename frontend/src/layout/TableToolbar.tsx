import { Theme } from '@mui/material';
import { withStyles, WithStyles } from '@mui/material/styles';
import { lighten } from '@mui/material/styles/colorManipulator';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import compose from '../utilities/compose';
import { ActionButton, ActionButtonAction } from './ActionButton';
import { ConfirmationButton } from './ConfirmationDialog';
import { FormHeader } from './FormHeader';
import { AddIcon } from './icons';

const toolbarStyles = (theme: Theme) => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.mode === 'light'
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
  deleteAction?: () => undefined;
  addAction?: ActionButtonAction;
  style?: React.CSSProperties;
  title: string;
  children?: React.ReactNode;
  error?: boolean;
}

const TableToolbar = compose(withStyles(toolbarStyles))((props: EnhancedTableToolbarProps) => {
  const { numSelected = 0, classes, deleteAction, addAction, style, title, error } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      style={style}
    >
      <div className={classes.title} style={{textTransform: 'capitalize'}}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            <FormattedMessage id="general.has_selected" values={{count: numSelected}} />
          </Typography>
        ) : (
          <FormHeader color={error ? 'error' : undefined}>{title}</FormHeader>
        )}
      </div>
      <div className={classes.spacer} />
      {props.children}
      <div className={classes.actions}>
        {numSelected > 0 && deleteAction ? (
          <ConfirmationButton onConfirm={deleteAction} />
        ) : (
          addAction && <ActionButton icon={AddIcon} action={addAction} />
        )}
      </div>
    </Toolbar>
  );
});

export default TableToolbar;
