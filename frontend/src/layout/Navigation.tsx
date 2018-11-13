import * as React from 'react';

import PeopleIcon from '@material-ui/icons/People';
import DriveFile from '@material-ui/icons/InsertDriveFile';
import ListIcon from '@material-ui/icons/List';
import { NavItem } from './NavItem';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { Collapsible } from './Collapsible';

interface NavigationProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Navigation = ({ handleDrawerOpen, drawerOpen }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/'} exact label={'Offerten'} icon={DriveFile} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
    <Collapsible icon={ListIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} />
      <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={AttachMoney} />
      <NavItem nested to={'/holidays'} label={'Feiertage'} />
    </Collapsible>
  </React.Fragment>
);
