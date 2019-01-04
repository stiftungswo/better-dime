import { RouteComponentProps, withRouter } from 'react-router';
import { Offer } from '../../types';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import * as React from 'react';

interface NavigatorProps extends RouteComponentProps {
  offer: Offer;
}

export default withRouter(({ offer: { project_id, invoice_ids, id }, history }: NavigatorProps) => (
  <Tabs scrollable value={0}>
    <Tab label={`Offerte ${id}`} />
    {project_id && <Tab onClick={() => history.push(`/projects/${project_id}`)} label={`Projekt ${project_id}`} />}
    {invoice_ids.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
    )}
  </Tabs>
));
