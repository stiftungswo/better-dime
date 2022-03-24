import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { TextField } from '../../form/fields/common';
import { DatePicker } from '../../form/fields/DatePicker';
import { DurationField } from '../../form/fields/DurationField';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { HolidayStore } from '../../stores/holidayStore';
import { MainStore } from '../../stores/mainStore';
import { Holiday } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { holidaySchema, holidayTemplate } from './holidaySchema';

interface Props {
  holidayStore?: HolidayStore;
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('holidayStore', 'mainStore'),
  observer,
)
export default class HolidayOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.holiday.overview');
    const holidayStore = this.props.holidayStore;

    const columns: Array<Column<Holiday>> = [
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
      {
        id: 'date',
        numeric: false,
        label: intlText('general.date', true),
        defaultSort: 'desc',
        format: h => this.props.mainStore!.formatDate(h.date),
      },
      {
        id: 'duration',
        numeric: false,
        label: intlText('duration'),
        format: h => this.props.mainStore!.formatDuration(h.duration),
      },
    ];

    return (
      <EditableOverview
        searchable
        title={intlText('title')}
        store={holidayStore!}
        columns={columns}
        schema={holidaySchema}
        defaultValues={holidayTemplate}
        renderActions={(e: Holiday) => (
          <ActionButtons
            copyAction={async () => {
              await holidayStore!.duplicate(e.id);
              await holidayStore!.fetchAll();
            }}
            deleteAction={() => holidayStore!.delete(e.id)}
            deleteMessage={intlText('delete_warning')}
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'name'} label={intlText('general.name', true)} />
            <DimeDatePickerField component={DatePicker} name={'date'} label={intlText('general.date', true)} />
            <DimeField component={DurationField} timeUnit={'hour'} name={'duration'} label={intlText('duration')} />
          </>
        )}
      />
    );
  }
}
