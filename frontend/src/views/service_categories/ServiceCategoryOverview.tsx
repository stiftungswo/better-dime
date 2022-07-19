import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ServiceCategorySelect } from '../../form/entitySelect/ServiceCategorySelect';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ServiceCategoryStore } from '../../stores/serviceCategoryStore';
import { ServiceCategory } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { serviceCategorySchema, serviceCategoryTemplate } from './serviceCategorySchema';

interface Props {
  mainStore?: MainStore;
  serviceCategoryStore?: ServiceCategoryStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'serviceCategoryStore'),
  observer,
)
export default class ServiceCategoryOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.service_category.overview');
    const serviceCategoryStore = this.props.serviceCategoryStore;
    const columns: Array<Column<ServiceCategory>> = [
      {
        id: 'order',
        numeric: false,
        label: intlText('sorting_order'),
        defaultSort: 'asc',
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
      {
        id: 'number',
        numeric: false,
        label: intlText('number'),
        defaultSort: 'asc',
      },
      {
        id: 'parent',
        numeric: false,
        label: intlText('parent'),
        format: e => (e.parent ? e.parent.name : '<root>'),
      },
    ];

    return (
      <EditableOverview
        searchable
        title={intlText('general.service_category.plural', true)}
        store={serviceCategoryStore!}
        columns={columns}
        schema={serviceCategorySchema}
        defaultValues={serviceCategoryTemplate}
        renderForm={() => (
          <>
            <DimeField component={TextField} required name={'name'} label={intlText('general.name', true)} />
            <DimeField component={NumberField} required name={'number'} label={intlText('number')} />
            <DimeField component={ServiceCategorySelect} topLevelOnly nullable name={'parent_category_id'} label={intlText('parent')} />
          </>
        )}
      />
    );
  }
}
