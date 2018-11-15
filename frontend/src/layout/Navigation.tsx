import * as React from 'react';

import PeopleIcon from '@material-ui/icons/People';
import DriveFile from '@material-ui/icons/InsertDriveFile';
import ListIcon from '@material-ui/icons/List';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { NavItem } from './NavItem';
import { AttachMoney, Domain, RoomService, Work, Weekend, Storage } from '@material-ui/icons/';
import { Collapsible } from './Collapsible';

interface NavigationProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Navigation = ({ handleDrawerOpen, drawerOpen }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/offers'} exact label={'Offerten'} icon={DriveFile} />
    <NavItem to={'/projects'} exact label={'Projekte'} icon={AssignmentIcon} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
    <Collapsible icon={Storage} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} icon={RoomService} />
      <NavItem nested to={'/rate_groups'} label={'Tarif-Gruppen'} icon={Domain} />
      <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={AttachMoney} />
      <NavItem nested to={'/holidays'} label={'Feiertage'} icon={Weekend} />
      <NavItem nested to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={Work} />
      <NavItem nested to={'customer_tags'} label={'Tags'} />
    </Collapsible>
  </React.Fragment>
);
