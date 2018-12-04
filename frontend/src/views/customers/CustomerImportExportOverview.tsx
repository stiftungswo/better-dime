import React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent, DimePaper } from '../../layout/DimeLayout';
import { Grid, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { CustomerFilter } from '../../types';
import { FormProps, SwitchField } from '../../form/fields/common';
import { ExportFormatSelector } from '../../form/entitySelector/ExportFormatSelector';
import Button from '@material-ui/core/Button/Button';
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
            <Grid item xs={12}>
              <CustomerExportForm {...this.props} />
            </Grid>

            <Grid item xs={12}>
              <CustomerImportForm />
            </Grid>
          </Grid>
        </DimeContent>
      </>
    );
  }
}
