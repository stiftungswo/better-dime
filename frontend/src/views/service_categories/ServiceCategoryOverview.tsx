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
import { detectFrench } from '../../utilities/detectFrench';
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
    const isFrench = detectFrench(this.props.intl!);
    const serviceCategoryStore = this.props.serviceCategoryStore;
    const columns: Array<Column<ServiceCategory>> = [
      {
        id: 'order',
        numeric: false,
        label: intlText('sorting_order'),
        defaultSort: 'asc',
      },
      {
        id: 'number',
        numeric: false,
        label: intlText('number'),
        defaultSort: 'asc',
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('german_name'),
      },
      {
        id: 'french_name',
        numeric: false,
        label: intlText('french_name'),
      },
      {
        id: 'parent',
        numeric: false,
        label: intlText('parent'),
        format: e => (e.parent ? (isFrench ? e.parent.french_name : e.parent.name) : '---'),
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
            <DimeField component={TextField} required name={'name'} label={intlText('german_name')} />
            <DimeField component={TextField} required name={'french_name'} label={intlText('french_name')} />
            <DimeField component={NumberField} required name={'number'} label={intlText('number')} />
            <DimeField component={ServiceCategorySelect} mode="toplevel" nullable name={'parent_category_id'} label={intlText('parent')} />
          </>
        )}
      />
    );
  }
}
