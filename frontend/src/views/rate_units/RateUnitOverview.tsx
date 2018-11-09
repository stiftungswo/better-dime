import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { RateUnit, RateUnitStore } from '../../stores/rateUnitStore';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import * as yup from 'yup';
import { NumberFieldWithValidation, SwitchField, TextFieldWithValidation } from '../../form/fields/common';
import { Field } from 'formik';

interface Props {
  mainStore?: MainStore;
  rateUnitStore?: RateUnitStore;
}

const schema = yup.object({
  archived: yup.boolean(),
  billing_unit: yup.string().required(),
  effort_unit: yup.string().required(),
  factor: yup.number().required(),
  is_time: yup.boolean(),
  name: yup.string().required(),
});

const defaultValues = {
  name: '',
  billing_unit: 'CHF /',
  effort_unit: '',
  factor: 1,
  is_time: false,
  archived: false,
};

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
      {
        id: 'archived',
        numeric: false,
        label: 'Archiviert',
        format: e => (e.archived ? 'Ja' : 'Nein'),
      },
    ];
  }

  public renderActions = (rateUnit: RateUnit) => <ActionButtons deleteAction={() => this.props.rateUnitStore!.delete(rateUnit.id!)} />;

  public filter = (r: RateUnit, query: string) => {
    return r.name.includes(query) || r.billing_unit.includes(query) || r.effort_unit.includes(query);
  };

  public render() {
    return (
      <EditableOverview
        title={'Tarif-Typen'}
        store={this.props.rateUnitStore!}
        columns={this.columns}
        schema={schema}
        defaultValues={defaultValues}
        searchFilter={this.filter}
        renderActions={this.renderActions}
        renderForm={props => (
          <>
            <Field component={TextFieldWithValidation} name={'name'} label={'Name'} fullWidth />
            <Field component={NumberFieldWithValidation} name={'factor'} label={'Umrechnungsfaktor'} />
            <Field component={TextFieldWithValidation} name={'billing_unit'} label={'Verrechnungseinheit'} />
            <Field component={TextFieldWithValidation} name={'effort_unit'} label={'Zeiterfassungseinheit'} />
            <Field component={SwitchField} name={'is_time'} label={'Zeiteinheit?'} />
            <Field component={SwitchField} name={'archived'} label={'Archiviert?'} />
          </>
        )}
      />
    );
  }
}
