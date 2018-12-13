import React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { Grid } from '@material-ui/core';
import { FormProps } from '../../form/fields/common';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { CustomerExportForm } from './CustomerExportForm';
import { CustomerImportForm } from './CustomerImportForm';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { RateGroupStore } from '../../stores/rateGroupStore';

interface Props extends FormProps {
  customerTagStore?: CustomerTagStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('customerTagStore', 'rateGroupStore'),
  observer
)
export class CustomerImportExportOverview extends React.Component<Props> {
  public state = {
    loading: true,
  };

  public componentWillMount(): void {
    Promise.all([this.props.customerTagStore!.fetchAll(), this.props.rateGroupStore!.fetchAll()]).then(() =>
      this.setState({ loading: false })
    );
  }

  public render() {
    return (
      <>
        <DimeAppBar title={'Kundendaten importieren / exportieren'} />

        <DimeContent loading={this.state.loading} paper={this.state.loading}>
          <Grid container spacing={24}>
            <CustomerExportForm {...this.props} />
            <CustomerImportForm />
          </Grid>
        </DimeContent>
      </>
    );
  }
}
