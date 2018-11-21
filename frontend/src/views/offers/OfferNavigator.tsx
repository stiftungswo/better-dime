import { RouteComponentProps, withRouter } from 'react-router';
import { Invoice, Offer, Project } from '../../types';
import { OfferStore } from '../../stores/offerStore';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import * as React from 'react';

interface NavigatorProps extends RouteComponentProps {
  offer: Offer;
  offerStore: OfferStore;
}

export default withRouter(({ offer: { project_ids, invoice_ids, id }, history, offerStore }: NavigatorProps) => (
  <Tabs value={0}>
    <Tab label={`Offerte ${id}`} />
    {project_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
    ))}
    {project_ids.length === 0 && (
      <Tab
        onClick={() => offerStore.createProject(id!).then((p: Project) => history.push(`/projects/${p.id}`))}
        label={'+ Projekt erstellen'}
      />
    )}
    {invoice_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
    <Tab
      onClick={() => offerStore.createInvoice(id!).then((i: Invoice) => history.push(`invoices/${i.id}`))}
      label={'+ Rechnung erstellen'}
    />
  </Tabs>
));
