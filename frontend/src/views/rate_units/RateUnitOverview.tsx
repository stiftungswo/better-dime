import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { RateUnit, RateUnitStore } from '../../stores/rateUnitStore';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { Field } from 'formik';
import { rateUnitSchema, rateUnitTemplate } from './rateUnitSchema';

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

  public filter = (r: RateUnit, query: string) => {
    return r.name.includes(query) || r.billing_unit.includes(query) || r.effort_unit.includes(query);
  };

  public render() {
    return (
      <EditableOverview
        archivable
        title={'Tarif-Typen'}
        store={this.props.rateUnitStore!}
        columns={this.columns}
        schema={rateUnitSchema}
        defaultValues={rateUnitTemplate}
        searchFilter={this.filter}
        renderActions={(e: RateUnit) => (
          <ActionButtons
            archiveAction={!e.archived ? () => this.props.rateUnitStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => this.props.rateUnitStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={props => (
          <>
            <Field component={TextField} name={'name'} label={'Name'} fullWidth />
            <Field component={NumberField} name={'factor'} label={'Umrechnungsfaktor'} />
            <Field component={TextField} name={'billing_unit'} label={'Verrechnungseinheit'} />
            <Field component={TextField} name={'effort_unit'} label={'Zeiterfassungseinheit'} />
            <Field component={SwitchField} name={'is_time'} label={'Zeiteinheit?'} />
            <Field component={SwitchField} name={'archived'} label={'Archiviert?'} />
          </>
        )}
      />
    );
  }
}
