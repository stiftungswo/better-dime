import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import * as React from 'react';
import UnstyledLink from './UnstyledLink';

import PeopleIcon from '@material-ui/icons/People';
import DriveFile from '@material-ui/icons/InsertDriveFile';
import { Route, RouteComponentProps } from 'react-router';

interface NavItemProps {
  label: string;
  icon: any;
  to: string;
  exact?: boolean;
  query?: string;
}

export const NavItem = ({ to, exact = false, query = '', label, icon }: NavItemProps) => {
  const Icon = icon;

  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }: RouteComponentProps) => (
        <UnstyledLink to={to + query}>
          <ListItem button={true} selected={!!match}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        </UnstyledLink>
      )}
    />
  );
};

export const Navigation = () => (
  <React.Fragment>
    <NavItem to={'/'} exact label={'Offerten'} icon={DriveFile} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
  </React.Fragment>
);
