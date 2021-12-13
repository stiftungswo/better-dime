import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Invoice } from '../../types';

interface NavigatorProps extends RouteComponentProps {
  invoice: Invoice;
}

export default withRouter(({ invoice: { project_id, offer_id, sibling_invoice_ids, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  const projects = project_id ? [project_id] : [];
  return (
    <Tabs variant={'scrollable'} value={offers.length + projects.length}>
      {offers.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={`Offerte ${pId}`} />
      ))}
      {projects.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
      ))}
      <Tab label={`Rechnung ${id}`} />
      {sibling_invoice_ids.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
      ))}
    </Tabs>
  );
});
