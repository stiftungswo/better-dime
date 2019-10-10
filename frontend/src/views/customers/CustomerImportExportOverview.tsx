import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import compose from '../../utilities/compose';
import { CustomerExportForm } from './CustomerExportForm';
import { CustomerImportForm } from './CustomerImportForm';

interface Props {
  customerTagStore?: CustomerTagStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('customerTagStore', 'rateGroupStore'),
  observer,
)
export class CustomerImportExportOverview extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentDidMount(): void {
    Promise.all([this.props.customerTagStore!.fetchAll(), this.props.rateGroupStore!.fetchAll()]).then(() =>
      this.setState({ loading: false }),
    );
  }

  render() {
    return (
      <>
        <DimeAppBar title={'Kundendaten importieren / exportieren'} />

        <DimeContent loading={this.state.loading} paper={this.state.loading}>
          <Grid container spacing={6}>
            <CustomerExportForm {...this.props} />
            <CustomerImportForm />
          </Grid>
        </DimeContent>
      </>
    );
  }
}
