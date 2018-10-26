import * as React from 'react';
import * as yup from 'yup';
import { inject, observer } from 'mobx-react';
import { Holiday, HolidayStore } from '../../stores/holidayStore';
import { Field } from 'formik';
import { Column } from '../../layout/Overview';
import { TextFieldWithValidation } from '../../form/fields/common';
import { EditableOverview } from '../../layout/EditableOverview';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { DurationField } from '../../form/fields/DurationField';
import { DatePicker } from '../../form/fields/DatePicker';
import { ActionButtons } from '../../layout/ActionButtons';

const schema = yup.object({
  name: yup.string().required(),
  date: yup.date().required(),
  duration: yup.number().required(),
});

const defaultValues = {
  name: '',
  date: new Date(),
  duration: 8.4 * 60,
};

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

  public renderActions = (holiday: Holiday) => <ActionButtons deleteAction={() => this.props.holidayStore!.delete(holiday.id!)} />;

  public filter = (h: Holiday, query: string) => {
    return h.name.includes(query) || this.props.mainStore!.formatDate(h.date).includes(query);
  };

  public render() {
    return (
      <EditableOverview
        title={'Feiertage'}
        store={this.props.holidayStore!}
        columns={this.columns}
        schema={schema}
        defaultValues={defaultValues}
        searchFilter={this.filter}
        renderActions={this.renderActions}
        renderForm={props => (
          <>
            <Field component={TextFieldWithValidation} name={'name'} label={'Name'} fullWidth />
            <Field component={DatePicker} name={'date'} label={'Datum'} fullWidth />
            <Field component={DurationField} name={'duration'} label={'Dauer'} fullWidth />
          </>
        )}
      />
    );
  }
}
