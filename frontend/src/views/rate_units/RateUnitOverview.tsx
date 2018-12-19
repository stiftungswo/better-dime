import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { Field } from 'formik';
import { rateUnitSchema, rateUnitTemplate } from './rateUnitSchema';
import { Grid } from '@material-ui/core';
import { RateUnit } from '../../types';

interface Props {
  mainStore?: MainStore;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('mainStore', 'rateUnitStore'),
  observer
)
export default class RateUnitOverview extends React.Component<Props> {
  public columns: Array<Column<RateUnit>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        numeric: false,
        label: 'Name',
      },
      {
        id: 'factor',
        numeric: true,
        label: 'Umrechnungsfaktor',
      },
      {
        id: 'billing_unit',
        numeric: false,
        label: 'Verrechnungseinheit',
      },
      {
        id: 'effort_unit',
        numeric: false,
        label: 'Zeiterfassungseinheit',
      },
      {
        id: 'is_time',
        numeric: false,
        label: 'Zeiteinheit',
        format: e => (e.is_time ? 'Ja' : 'Nein'),
      },
    ];
  }

  public render() {
    return (
      <EditableOverview
        archivable
        searchable
        title={'Tarif-Typen'}
        store={this.props.rateUnitStore!}
        columns={this.columns}
        schema={rateUnitSchema}
        defaultValues={rateUnitTemplate}
        renderActions={(e: RateUnit) => (
          <ActionButtons
            archiveAction={!e.archived ? () => this.props.rateUnitStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => this.props.rateUnitStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={props => (
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Field component={TextField} name={'name'} label={'Name'} fullWidth />
            </Grid>

            <Grid item xs={4}>
              <Field component={NumberField} name={'factor'} label={'Umrechnungsfaktor'} />
            </Grid>

            <Grid item xs={4}>
              <Field component={TextField} name={'billing_unit'} label={'Verrechnungseinheit'} />
            </Grid>

            <Grid item xs={4}>
              <Field component={TextField} name={'effort_unit'} label={'Zeiterfassungseinheit'} />
            </Grid>

            <Grid item xs={6}>
              <Field component={SwitchField} name={'is_time'} label={'Zeiteinheit?'} />
            </Grid>

            <Grid item xs={6}>
              <Field component={SwitchField} name={'archived'} label={'Archiviert?'} />
            </Grid>
          </Grid>
        )}
      />
    );
  }
}
