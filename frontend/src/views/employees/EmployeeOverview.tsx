import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { EmployeeStore } from '../../stores/employeeStore';
import { Employee, EmployeeListing } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

type Props = {
  employeeStore?: EmployeeStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('employeeStore'),
  observer,
  withRouter,
)
export default class EmployeeOverview extends React.Component<Props> {
  render() {
    const employeeStore = this.props.employeeStore;
    const intlText = wrapIntl(this.props.intl!, 'view.employee');

    const columns: Array<Column<Employee>> = [
      {
        id: 'id',
        label: 'ID',
        numeric: false,
      },
      {
        id: 'first_name',
        label: intlText('first_name'),
      },
      {
        id: 'last_name',
        label: intlText('last_name'),
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: 'group_name',
        orderTag: 'employee_group_id',
        label: intlText('group'),
      },
      {
        id: 'can_login',
        label: intlText('can_login'),
        format: e => (e.can_login ? intlText('general.yes', true) : intlText('general.no', true)),
      },
    ];

    return (
      <Overview
        archivable
        paginated
        title={intlText('general.employee.plural', true)}
        store={employeeStore!}
        addAction={'/employees/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Employee = await employeeStore!.duplicate(e.id);
                this.props.history.push(`/employees/${newEntity.id}`);
              }
            }}
            archiveAction={(!e.archived && e.id) ? () => employeeStore!.archive(e.id!, true).then(r => employeeStore!.fetchAllPaginated()) : undefined}
            restoreAction={(e.archived && e.id) ? () => employeeStore!.archive(e.id!, false).then(r => employeeStore!.fetchAllPaginated()) : undefined}
          />
        )}
        onClickRow={'/employees/:id'}
        columns={columns}
        searchable
      />
    );
  }
}
