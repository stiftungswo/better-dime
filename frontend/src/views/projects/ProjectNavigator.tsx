import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import StyledTab from '../../layout/StyledTab';
import { Project } from '../../types';
import { wrapIntl } from '../../utilities/wrapIntl';

interface NavigatorProps extends RouteComponentProps {
  project: Project;
}

export default withRouter(({ project: { offer_id, invoice_ids, id }, history }: NavigatorProps) => {
  const offers = offer_id ? [offer_id] : [];
  const intlText = wrapIntl(useIntl(), 'general');
  return (
    <Tabs value={offers.length} variant={'scrollable'}>
      {offers.map(pId => (
        <StyledTab key={pId} onClick={() => history.push(`/offers/${pId}`)} label={intlText('offer') + ` ${pId}`} />
      ))}
      <StyledTab label={intlText('project') + ` ${id}`} />
      {invoice_ids.map(pId => (
        <StyledTab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={intlText('invoice') + ` ${pId}`} />
      ))}
    </Tabs>
  );
});
