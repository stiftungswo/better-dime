import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { MainStore } from '../../stores/mainStore';
import { CustomerTag } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { customerTagSchema, customerTagTemplate } from './customerTagSchema';

interface Props {
  mainStore?: MainStore;
  customerTagStore?: CustomerTagStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'customerTagStore'),
  observer,
)
export default class CustomerTagOverview extends React.Component<Props> {
  render() {
    const customerTagStore = this.props.customerTagStore!;
    const intl = this.props.intl!;
    const columns: Array<Column<CustomerTag>> = [
      {
        id: 'id',
        numeric: false,
        label: 'ID',
      },
      {
        id: 'name',
        numeric: false,
        label: intl.formatMessage({id: 'general.name'}),
      },
    ];

    return (
      <EditableOverview
        archivable
        searchable
        title={intl.formatMessage({id: 'general.tag.plural'})}
        store={customerTagStore}
        columns={columns}
        schema={customerTagSchema}
        defaultValues={customerTagTemplate}
        renderActions={(e: CustomerTag) => (
          <ActionButtons
            archiveAction={!e.archived ? () => customerTagStore.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => customerTagStore.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <DimeField delayed component={TextField} name={'name'} label={intl.formatMessage({id: 'general.name'})} />
            <DimeField delayed component={SwitchField} name={'archived'} label={intl.formatMessage({id: 'general.is_archived'})} />
          </>
        )}
      />
    );
  }
}
