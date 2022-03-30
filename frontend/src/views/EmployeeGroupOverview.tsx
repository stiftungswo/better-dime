import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
import { wrapIntl } from '../utilities/wrapIntl';

interface Props {
  mainStore?: MainStore;
  employeeGroupStore?: EmployeeGroupStore;
  intl?: IntlShape;
}

const schema = yup.object({
  name: yup.string().required(),
});

const template = {
  name: '',
};

@compose(
  injectIntl,
  inject('mainStore', 'employeeGroupStore'),
  observer,
)
export default class EmployeeGroupOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.employee_group.overview');
    const employeeGroupStore = this.props.employeeGroupStore;

    const columns: Array<Column<EmployeeGroup>> = [
      {
        id: 'id',
        numeric: false,
        label: 'ID',
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
    ];

    return (
      <EditableOverview
        searchable
        title={intlText('title')}
        store={employeeGroupStore!}
        columns={columns}
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
