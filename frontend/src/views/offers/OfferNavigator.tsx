import { RouteComponentProps, withRouter } from 'react-router';
import { Invoice, Offer, Project } from '../../types';
import { OfferStore } from '../../stores/offerStore';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import * as React from 'react';
import { ProjectStore } from '../../stores/projectStore';

interface NavigatorProps extends RouteComponentProps {
  offer: Offer;
  offerStore: OfferStore;
  projectStore: ProjectStore;
}

export default withRouter(({ offer: { project_id, invoice_ids, id }, history, offerStore, projectStore }: NavigatorProps) => (
  <Tabs scrollable value={0}>
    <Tab label={`Offerte ${id}`} />
    {project_id ? (
      <Tab onClick={() => history.push(`/projects/${project_id}`)} label={`Projekt ${project_id}`} />
    ) : (
      <Tab
        onClick={() => offerStore.createProject(id!).then((p: Project) => history.push(`/projects/${p.id}`))}
        label={'+ Projekt erstellen'}
      />
    )}
    {invoice_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
    {project_id && (
      <Tab
        onClick={() => projectStore.createInvoice(project_id).then((i: Invoice) => history.push(`/invoices/${i.id}`))}
        label={'+ Rechnung erstellen'}
      />
    )}
  </Tabs>
));
