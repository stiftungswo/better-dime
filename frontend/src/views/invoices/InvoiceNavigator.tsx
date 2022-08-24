import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import StyledTab from '../../layout/StyledTab';
import { Invoice } from '../../types';
import { wrapIntl } from '../../utilities/wrapIntl';

interface NavigatorProps extends RouteComponentProps {
  invoice: Invoice;
}

export default withRouter(({ invoice: { project_id, offer_id, sibling_invoice_ids, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  const projects = project_id ? [project_id] : [];
  const intlText = wrapIntl(useIntl(), 'general');
  return (
    <Tabs variant={'scrollable'} value={offers.length + projects.length}>
      {offers.map(pId => (
        <StyledTab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={intlText('offer') + ` ${pId}`} />
      ))}
      {projects.map(pId => (
        <StyledTab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={intlText('project') + ` ${pId}`} />
      ))}
      <StyledTab label={intlText('invoice') + ` ${id}`} />
      {sibling_invoice_ids.map(pId => (
        <StyledTab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={intlText('invoice') + ` ${pId}`} />
      ))}
    </Tabs>
  );
});
