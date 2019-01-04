import { RouteComponentProps, withRouter } from 'react-router';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { Invoice, Project } from '../../types';
import * as React from 'react';
import { ProjectStore } from '../../stores/projectStore';

interface NavigatorProps extends RouteComponentProps {
  project: Project;
  projectStore: ProjectStore;
}

export default withRouter(({ project: { offer_id, invoice_ids, id }, projectStore, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  return (
    <Tabs value={offers.length} scrollable>
      {offers.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={`Offerte ${pId}`} />
      ))}
      <Tab label={`Projekt ${id}`} />
      {invoice_ids.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
      ))}
      <Tab
        onClick={() => projectStore.createInvoice(id!).then((i: Invoice) => history.push(`/invoices/${i.id}`))}
        label={'+ Rechnung erstellen'}
      />
    </Tabs>
  );
});
