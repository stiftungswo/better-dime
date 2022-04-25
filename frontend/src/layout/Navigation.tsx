import * as React from 'react';
import { useIntl } from 'react-intl';
import { wrapIntl } from '../utilities/wrapIntl';

import { Collapsible } from './Collapsible';
import {
  AddCommentIcon,
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

export const Navigation = ({ drawerOpen, handleDrawerOpen, isAdmin }: NavigationProps) => {
  const intlText = wrapIntl(useIntl(), 'layout.navigation');
  return (
    <>
      <NavItem to={'/timetrack'} exact label={intlText('timetrack')} icon={TimetrackIcon} />
      <NavItem to={'/offers'} exact label={intlText('offers')} icon={OfferIcon} />
      <Collapsible icon={ProjectIcon} label={intlText('projects')} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
        <NavItem nested to={'/projects'} exact label={intlText('projects.all')} icon={ProjectIcon} />
        <NavItem nested to={'/projects/potential_invoices'} exact label={intlText('projects.invoiceless')} icon={InvoiceIcon} />
      </Collapsible>
      <NavItem to={'/invoices'} label={intlText('invoices')} icon={InvoiceIcon} />
      <NavItem to={'/employees'} label={intlText('employees')} icon={EmployeeIcon} />
      <Collapsible icon={CustomersIcon} label={intlText('customers')} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
        <NavItem nested to={'/persons'} label={intlText('customers.persons')} icon={PersonIcon} />
        <NavItem nested to={'/companies'} label={intlText('customers.companies')} icon={CompanyIcon} />
        <NavItem nested to={'/customer_tags'} label={intlText('customers.tags')} icon={TagsIcon} />
        <NavItem nested to={'/customers/transfer'} label={intlText('customers.transfer')} icon={ImportExportIcon} />
      </Collapsible>
      <Collapsible icon={ReportIcon} label={intlText('reports')} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
        <NavItem nested to={'/reports/daily'} label={intlText('reports.daily')} />
        <NavItem nested to={'/reports/service'} label={intlText('reports.service')} />
        <NavItem nested to={'/reports/revenue'} label={intlText('reports.revenue')} />
        <NavItem nested to={'/reports/employees'} label={intlText('reports.employees')} />
        <NavItem nested to={'/reports/project'} label={intlText('reports.project')} />
        <NavItem nested to={'/reports/costgroup'} label={intlText('reports.costgroup')} />
      </Collapsible>
      <Collapsible icon={MasterDataIcon} label={intlText('data')} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
        <NavItem nested to={'/services'} label={intlText('data.services')} icon={ServiceIcon} />
        <NavItem nested to={'/rate_groups'} label={intlText('data.rate_groups')} icon={RateGroupIcon} />
        {isAdmin && <NavItem nested to={'/rate_units'} label={intlText('data.rate_units')} icon={RateUnitIcon} />}
        {isAdmin && <NavItem nested to={'/employee_groups'} label={intlText('data.employee_groups')} icon={EmployeeIcon} />}
        {isAdmin && <NavItem nested to={'/comment_presets'} label={intlText('data.comment_presets')} icon={AddCommentIcon} />}
        <NavItem nested to={'/holidays'} label={intlText('data.holidays')} icon={HolidayIcon} />
        <NavItem nested to={'/project_categories'} label={intlText('data.project_categories')} icon={ProjectCategoryIcon} />
        <NavItem nested to={'/cost_groups'} label={intlText('general.cost_group.plural', true)} icon={ProjectCategoryIcon} />
        {isAdmin && <NavItem nested to={'/global_settings'} label={intlText('data.global_settings')} icon={SettingsIcon} />}
      </Collapsible>
    </>
  );
};
