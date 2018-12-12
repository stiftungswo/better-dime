import * as React from 'react';

import { NavItem } from './NavItem';
import { Collapsible } from './Collapsible';
import {
  CompanyIcon,
  CustomersIcon,
  EmployeeIcon,
  HolidayIcon,
  ImportExportIcon,
  InvoiceIcon,
  MasterDataIcon,
  OfferIcon,
  PersonIcon,
  ProjectCategoryIcon,
  ProjectIcon,
  RateGroupIcon,
  RateUnitIcon,
  ReportIcon,
  ServiceIcon,
  TagsIcon,
  TimetrackIcon,
} from './icons';

interface NavigationProps {
  drawerOpen: boolean;
  handleDrawerOpen: () => void;
  isAdmin: boolean;
}

export const Navigation = ({ drawerOpen, handleDrawerOpen, isAdmin }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/timetrack'} exact label={'Zeiterfassung'} icon={TimetrackIcon} />
    <NavItem to={'/offers'} exact label={'Offerten'} icon={OfferIcon} />
    <NavItem to={'/projects'} exact label={'Projekte'} icon={ProjectIcon} />
    <NavItem to={'/invoices'} label={'Rechnungen'} icon={InvoiceIcon} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={EmployeeIcon} />
    <Collapsible icon={CustomersIcon} label={'Kunden'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/persons'} label={'Personen'} icon={PersonIcon} />
      <NavItem nested to={'/companies'} label={'Firmen'} icon={CompanyIcon} />
      <NavItem nested to={'/customer_tags'} label={'Tags'} icon={TagsIcon} />
      <NavItem nested to={'/customers/transfer'} label={'Import / Export'} icon={ImportExportIcon} />
    </Collapsible>
    <Collapsible icon={ReportIcon} label={'Rapporte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/reports/daily'} label={'Wochenrapport'} />
      <NavItem nested to={'/reports/service'} label={'Service-Rapporte'} />
      <NavItem nested to={'/reports/revenue'} label={'Umsatzrapport'} />
    </Collapsible>
    <Collapsible icon={MasterDataIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} icon={ServiceIcon} />
      <NavItem nested to={'/rate_groups'} label={'Tarif-Gruppen'} icon={RateGroupIcon} />
      {isAdmin && <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={RateUnitIcon} />}
      <NavItem nested to={'/holidays'} label={'Feiertage'} icon={HolidayIcon} />
      <NavItem nested to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={ProjectCategoryIcon} />
    </Collapsible>
  </React.Fragment>
);
