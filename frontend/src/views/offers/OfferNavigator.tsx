import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import StyledTab from '../../layout/StyledTab';
import { Offer } from '../../types';
import { wrapIntl } from '../../utilities/wrapIntl';

interface NavigatorProps extends RouteComponentProps {
  offer: Offer;
}

export default withRouter(({ offer: { project_id, invoice_ids, id }, history }: NavigatorProps) => {
  const intlText = wrapIntl(useIntl(), 'general');
  return (
  <Tabs variant={'scrollable'} value={0}>
    <StyledTab label={intlText('offer') + ` ${id}`} />
    {project_id && <StyledTab onClick={() => history.push(`/projects/${project_id}`)} label={intlText('project') + ` ${project_id}`} />}
    {invoice_ids.map(pId => (
      <StyledTab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={intlText('invoice') + ` ${pId}`} />
    ))}
  </Tabs>
  );
});
