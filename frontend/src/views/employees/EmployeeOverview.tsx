import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { EmployeeStore } from '../../stores/employeeStore';
import { Employee, EmployeeListing } from '../../types';
import compose from '../../utilities/compose';

type Props = {
  employeeStore?: EmployeeStore;
} & RouteComponentProps;

@compose(
  inject('employeeStore'),
  observer,
  withRouter,
)
export default class EmployeeOverview extends React.Component<Props> {
  columns: Array<Column<Employee>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        label: 'ID',
        numeric: true,
      },
      {
        id: 'first_name',
        label: 'Vorname',
      },
      {
        id: 'last_name',
        label: 'Nachname',
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: 'group_name',
        label: 'Gruppe',
      },
      {
        id: 'can_login',
        label: 'Login aktiviert?',
        format: e => (e.can_login ? 'Ja' : 'Nein'),
      },
    ];
  }

  render() {
    const employeeStore = this.props.employeeStore;

    return (
      <Overview
        archivable
        paginated
        title={'Mitarbeiter'}
        store={employeeStore!}
        addAction={'/employees/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Employee = await employeeStore!.duplicate(e.id);
              this.props.history.push(`/employees/${newEntity.id}`);
            }}
            archiveAction={!e.archived ? () => employeeStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => employeeStore!.archive(e.id, false) : undefined}
          />
        )}
        onClickRow={'/employees/:id'}
        columns={this.columns}
        searchable
      />
    );
  }
}
