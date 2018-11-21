import { RouteComponentProps, withRouter } from 'react-router';
import { Invoice } from '../../types';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import * as React from 'react';

interface NavigatorProps extends RouteComponentProps {
  invoice: Invoice;
}

export default withRouter(({ invoice: { project_id, offer_id, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  const projects = project_id ? [project_id] : [];
  return (
    <Tabs value={offers.length + projects.length}>
      {offers.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={`Offerte ${pId}`} />
      ))}
      {projects.map(pId => (
        <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Projekt ${pId}`} />
      ))}
      <Tab label={`Rechnung ${id}`} />
    </Tabs>
  );
});
