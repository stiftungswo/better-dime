import { Grid } from '@mui/material';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { CustomerExportForm } from './CustomerExportForm';
import { CustomerImportForm } from './CustomerImportForm';

interface Props {
  customerTagStore?: CustomerTagStore;
  rateGroupStore?: RateGroupStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('customerTagStore', 'rateGroupStore'),
  observer,
)
export class CustomerImportExportOverview extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentDidMount() {
    Promise.all([this.props.customerTagStore!.fetchAll(), this.props.rateGroupStore!.fetchAll()]).then(() =>
      this.setState({ loading: false }),
    );
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.customer.import_export_overview');
    return (
      <>
        <DimeAppBar title={intlText('title')} />

        <DimeContent loading={this.state.loading} paper={this.state.loading}>
          <Grid container spacing={3}>
            <CustomerExportForm {...this.props} />
            <CustomerImportForm />
          </Grid>
        </DimeContent>
      </>
    );
  }
}
