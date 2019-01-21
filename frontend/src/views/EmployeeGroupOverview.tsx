import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../layout/Overview';
import { ActionButtons } from '../layout/ActionButtons';
import { EditableOverview } from '../layout/EditableOverview';
import * as yup from 'yup';
import { EmployeeGroup } from '../types';
import { DimeField } from '../form/fields/formik';
import { SwitchField, TextField } from '../form/fields/common';
import { EmployeeGroupStore } from '../stores/employeeGroupStore';

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
  observer
)
export default class EmployeeGroupOverview extends React.Component<Props> {
  public columns: Array<Column<EmployeeGroup>> = [];

  public constructor(props: Props) {
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

  public render() {
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
