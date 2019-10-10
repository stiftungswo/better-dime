import * as React from 'react';

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
  SettingsIcon,
  TagsIcon,
  TimetrackIcon,
} from './icons';
import { NavItem } from './NavItem';

interface NavigationProps {
  drawerOpen: boolean;
  handleDrawerOpen: () => void;
  isAdmin: boolean;
}

export const Navigation = ({ drawerOpen, handleDrawerOpen, isAdmin }: NavigationProps) => (
  <>
    <NavItem to={'/timetrack'} exact label={'Zeiterfassung'} icon={TimetrackIcon} />
    <NavItem to={'/offers'} exact label={'Offerten'} icon={OfferIcon} />
    <Collapsible icon={ProjectIcon} label={'Projekte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem to={'/projects'} exact label={'Alle'} icon={ProjectIcon} />
      <NavItem to={'/projects/potential_invoices'} exact label={'Nicht verrechnet'} icon={InvoiceIcon} />
    </Collapsible>
    <NavItem to={'/invoices'} label={'Rechnungen'} icon={InvoiceIcon} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={EmployeeIcon} />
    <Collapsible icon={CustomersIcon} label={'Kunden'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem to={'/persons'} label={'Personen'} icon={PersonIcon} />
      <NavItem to={'/companies'} label={'Firmen'} icon={CompanyIcon} />
      <NavItem to={'/customer_tags'} label={'Tags'} icon={TagsIcon} />
      <NavItem to={'/customers/transfer'} label={'Import / Export'} icon={ImportExportIcon} />
    </Collapsible>
    <Collapsible icon={ReportIcon} label={'Rapporte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem to={'/reports/daily'} label={'Wochenrapport'} />
      <NavItem to={'/reports/service'} label={'Service-Rapporte'} />
      <NavItem to={'/reports/revenue'} label={'Umsatzrapport'} />
      <NavItem to={'/reports/project'} label={'Projektrapport'} />
      <NavItem to={'/reports/costgroup'} label={'Kostenstellenraport'} />
    </Collapsible>
    <Collapsible icon={MasterDataIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem to={'/services'} label={'Services'} icon={ServiceIcon} />
      <NavItem to={'/rate_groups'} label={'Tarif-Gruppen'} icon={RateGroupIcon} />
      {isAdmin && <NavItem to={'/rate_units'} label={'Tarif-Typen'} icon={RateUnitIcon} />}
      {isAdmin && <NavItem to={'/employee_groups'} label={'Mitarbeiter-Gruppen'} icon={EmployeeIcon} />}
      <NavItem to={'/holidays'} label={'Feiertage'} icon={HolidayIcon} />
      <NavItem to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={ProjectCategoryIcon} />
      {isAdmin && <NavItem to={'/global_settings'} label={'Einstellungen'} icon={SettingsIcon} />}
    </Collapsible>
  </>
);
