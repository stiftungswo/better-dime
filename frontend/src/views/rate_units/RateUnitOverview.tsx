import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { RateUnit } from '../../types';
import compose from '../../utilities/compose';
import { rateUnitSchema, rateUnitTemplate } from './rateUnitSchema';

interface Props {
  mainStore?: MainStore;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('mainStore', 'rateUnitStore'),
  observer,
)
export default class RateUnitOverview extends React.Component<Props> {
  columns: Array<Column<RateUnit>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'listing_name',
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

  archiveRateUnit(e: RateUnit, archive: boolean) {
    this.props.rateUnitStore!.archive(e.id, archive).then(() => this.props.rateUnitStore!.fetchAllPaginated());
  }

  render() {
    return (
      <EditableOverview
        archivable
        paginated
        searchable
        title={'Tarif-Typen'}
        store={this.props.rateUnitStore!}
        columns={this.columns}
        schema={rateUnitSchema}
        defaultValues={rateUnitTemplate}
        renderActions={(e: RateUnit) => (
          <ActionButtons
            archiveAction={!e.archived ? () => this.archiveRateUnit(e, true) : undefined}
            restoreAction={e.archived ? () => this.archiveRateUnit(e, false) : undefined}
          />
        )}
        renderForm={props => (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <DimeField component={TextField} name={'name'} label={'Name'} />
            </Grid>

            <Grid item xs={4}>
              <DimeField component={NumberField} name={'factor'} label={'Umrechnungsfaktor'} />
            </Grid>

            <Grid item xs={4}>
              <DimeField component={TextField} name={'billing_unit'} label={'Verrechnungseinheit'} />
            </Grid>

            <Grid item xs={4}>
              <DimeField component={TextField} name={'effort_unit'} label={'Zeiterfassungseinheit'} />
            </Grid>

            <Grid item xs={6}>
              <DimeField component={SwitchField} name={'is_time'} label={'Zeiteinheit?'} />
            </Grid>

            <Grid item xs={6}>
              <DimeField component={SwitchField} name={'archived'} label={'Archiviert?'} />
            </Grid>
          </Grid>
        )}
      />
    );
  }
}
