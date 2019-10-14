import { Theme, withStyles, WithStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import classNames from 'classnames';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import compose from '../utilities/compose';
import { ArrowRightIcon } from './icons';
import UnstyledLink from './UnstyledLink';

export const styles = (theme: Theme) => ({
  default: {
    paddingLeft: theme.spacing(4),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

interface NavItemProps extends WithStyles<typeof styles> {
  label: string;
  icon?: React.ComponentType;
  to: string;
  exact?: boolean;
  query?: string;
  nested: boolean;
}

export const NavItem = compose(withStyles(styles))(
  ({ to, exact = false, query = '', label, icon, classes, nested = false }: NavItemProps) => {
    const Icon = icon || ArrowRightIcon;

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
  },
);
