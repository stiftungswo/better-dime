import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { TextField } from '../../form/fields/common';
import { DatePicker } from '../../form/fields/DatePicker';
import { DurationField } from '../../form/fields/DurationField';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { HolidayStore } from '../../stores/holidayStore';
import { MainStore } from '../../stores/mainStore';
import { Holiday } from '../../types';
import compose from '../../utilities/compose';
import { holidaySchema, holidayTemplate } from './holidaySchema';

interface Props {
  holidayStore?: HolidayStore;
  mainStore?: MainStore;
}

@compose(
  inject('holidayStore', 'mainStore'),
  observer,
)
export default class HolidayOverview extends React.Component<Props> {
  columns: Array<Column<Holiday>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        numeric: false,
        label: 'Name',
      },
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
        defaultSort: 'desc',
        format: h => this.props.mainStore!.formatDate(h.date),
      },
      {
        id: 'duration',
        numeric: false,
        label: 'Dauer',
        format: h => this.props.mainStore!.formatDuration(h.duration),
      },
    ];
  }

  render() {
    const holidayStore = this.props.holidayStore;

    return (
      <EditableOverview
        searchable
        title={'Feiertage'}
        store={holidayStore!}
        columns={this.columns}
        schema={holidaySchema}
        defaultValues={holidayTemplate}
        renderActions={(e: Holiday) => (
          <ActionButtons
            copyAction={async () => {
              await holidayStore!.duplicate(e.id);
              await holidayStore!.fetchAll();
            }}
            deleteAction={() => holidayStore!.delete(e.id)}
            deleteMessage={
              'Möchtest du diesen Feiertag wirklich löschen? ' +
              'Die Zeit, welche vorher durch den Feiertag gutgeschrieben wurde, wird allen Mitarbeitern abgezogen!'
            }
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'name'} label={'Name'} />
            <DimeField component={DatePicker} name={'date'} label={'Datum'} />
            <DimeField component={DurationField} timeUnit={'hour'} name={'duration'} label={'Dauer'} />
          </>
        )}
      />
    );
  }
}
