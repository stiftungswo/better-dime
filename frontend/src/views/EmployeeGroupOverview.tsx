import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import { SwitchField, TextField } from '../form/fields/common';
import { DimeField } from '../form/fields/formik';
import { ActionButtons } from '../layout/ActionButtons';
import { EditableOverview } from '../layout/EditableOverview';
import { Column } from '../layout/Overview';
import { EmployeeGroupStore } from '../stores/employeeGroupStore';
import { MainStore } from '../stores/mainStore';
import { EmployeeGroup } from '../types';
import compose from '../utilities/compose';

interface Props {
  mainStore?: MainStore;
  employeeGroupStore?: EmployeeGroupStore;
}

const schema = yup.object({
  name: yup.string().required(),
});

const template = {
  name: '',
};

@compose(
  inject('mainStore', 'employeeGroupStore'),
  observer,
)
export default class EmployeeGroupOverview extends React.Component<Props> {
  columns: Array<Column<EmployeeGroup>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        numeric: false,
        label: 'ID',
      },
      {
        id: 'name',
        numeric: false,
        label: 'Name',
      },
    ];
  }

  render() {
    const employeeGroupStore = this.props.employeeGroupStore;

    return (
      <EditableOverview
        searchable
        title={'Mitarbeiter Gruppen'}
        store={employeeGroupStore!}
        columns={this.columns}
        schema={schema}
        defaultValues={template}
        renderActions={(e: EmployeeGroup) => <ActionButtons deleteAction={() => employeeGroupStore!.delete(e.id)} />}
        renderForm={() => (
          <>
            <DimeField delayed component={TextField} name={'name'} label={'Name'} />
          </>
        )}
      />
    );
  }
}
