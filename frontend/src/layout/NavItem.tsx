import { Theme, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { ComponentType } from 'react';
import compose from '../utilities/compose';
import withStyles from '@material-ui/core/es/styles/withStyles';
import { Route, RouteComponentProps } from 'react-router';
import UnstyledLink from './UnstyledLink';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { ArrowRightIcon } from './icons';
import classNames from 'classnames';

export const styles = (theme: Theme) => ({
  default: {
    paddingLeft: theme.spacing.unit * 3,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

interface NavItemProps extends WithStyles<typeof styles> {
  label: string;
  icon?: ComponentType;
  to: string;
  exact?: boolean;
  query?: string;
  nested: boolean;
}

export const NavItem = compose(withStyles(styles))(
  ({ to, exact = false, query = '', label, icon, classes, nested = false }: NavItemProps) => {
    const Icon = icon || ArrowRightIcon;
    const nestedClassNames = nested ? classes.nested : '';

    return (
      <Route
        path={to}
        exact={exact}
        children={({ match }: RouteComponentProps) => (
          <UnstyledLink to={to + query}>
            <ListItem button selected={Boolean(match)} className={classNames(classes.default, { [classes.nested]: nested })}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </UnstyledLink>
        )}
      />
    );
  }
);
