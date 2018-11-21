import { Theme, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { ComponentType } from 'react';
import compose from '../utilities/compose';
import withStyles from '@material-ui/core/es/styles/withStyles';
import DimeTheme from './DimeTheme';
import { Route, RouteComponentProps } from 'react-router';
import UnstyledLink from './UnstyledLink';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { ArrowRightIcon } from './icons';

const styles = (theme: Theme) => ({
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

export const NavItem = compose(withStyles(styles(DimeTheme)))(
  ({ to, exact = false, query = '', label, icon, classes, nested = false }: NavItemProps) => {
    const Icon = icon || ArrowRightIcon;

    //FIXME this left-padding seems to be overwritten by other styles that are also present
    const nestedClassNames = nested ? classes.nested : '';

    return (
      <Route
        path={to}
        exact={exact}
        children={({ match }: RouteComponentProps) => (
          <UnstyledLink to={to + query}>
            <ListItem button={true} selected={!!match} className={nestedClassNames}>
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
