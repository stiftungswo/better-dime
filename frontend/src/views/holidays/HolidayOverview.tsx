import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { HolidayStore } from '../../stores/holidayStore';
import { Column } from '../../layout/Overview';
import { TextField } from '../../form/fields/common';
import { EditableOverview } from '../../layout/EditableOverview';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { DurationField } from '../../form/fields/DurationField';
import { DatePicker } from '../../form/fields/DatePicker';
import { ActionButtons } from '../../layout/ActionButtons';
import { holidaySchema, holidayTemplate } from './holidaySchema';
import { Holiday } from '../../types';
import { DimeField } from '../../form/fields/formik';

interface Props {
  holidayStore?: HolidayStore;
  mainStore?: MainStore;
}

@compose(
  inject('holidayStore', 'mainStore'),
  observer
)
export default class HolidayOverview extends React.Component<Props> {
  public columns: Array<Column<Holiday>> = [];

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

  public render() {
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
              'Möchtest du diesen Feiertag wirklich löschen? Die Zeit, welche vorher durch den Feiertag gutgeschrieben wurde, wird allen Mitarbeitern abgezogen!'
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
