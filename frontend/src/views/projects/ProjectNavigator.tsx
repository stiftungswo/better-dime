import { RouteComponentProps, withRouter } from 'react-router';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { Project } from '../../types';
import * as React from 'react';

interface NavigatorProps extends RouteComponentProps {
  project: Project;
}

export default withRouter(({ project: { offer_id, invoice_ids, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  return (
    <Tabs value={offers.length} variant={'scrollable'}>
      {offers.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={`Offerte ${pId}`} />
      ))}
      <Tab label={`Projekt ${id}`} />
      {invoice_ids.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
      ))}
    </Tabs>
  );
});
