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

interface NavItemProps {
  label: string;
  icon?: React.ComponentType;
  to: string;
  exact?: boolean;
  query?: string;
}

export const NavItem = ({ to, exact = false, query = '', label, icon }: NavItemProps) => {
  const Icon = icon || ArrowRightIcon;

  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }: RouteComponentProps) => (
        <UnstyledLink to={to + query}>
          <ListItem button selected={Boolean(match)}>
            <ListItemIcon>
              <Icon/>
            </ListItemIcon>
            <ListItemText primary={label}/>
          </ListItem>
        </UnstyledLink>
      )}
    />
  );
};
