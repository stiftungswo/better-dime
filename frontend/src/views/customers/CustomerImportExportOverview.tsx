import React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeLayout';
import { Grid } from '@material-ui/core';
import { FormProps } from '../../form/fields/common';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../stores/mainStore';
import { CustomerExportForm } from './CustomerExportForm';
import { CustomerImportForm } from './CustomerImportForm';

interface Props extends FormProps {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export class CustomerImportExportOverview extends React.Component<Props> {
  public render() {
    return (
      <>
        <DimeAppBar title={'Kundendaten importieren / exportieren'} />

        <DimeContent loading={false} paper={false}>
          <Grid container spacing={24}>
            <CustomerExportForm {...this.props} />
            <CustomerImportForm />
          </Grid>
        </DimeContent>
      </>
    );
  }
}
