import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { Category } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { projectCategorySchema, projectCategoryTemplate } from './projectCategorySchema';

interface Props {
  mainStore?: MainStore;
  projectCategoryStore?: ProjectCategoryStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'projectCategoryStore'),
  observer,
)
export default class ProjectCategoryOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.project_category.overview');
    const projectCategoryStore = this.props.projectCategoryStore;
    const columns: Array<Column<Category>> = [
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
        archivable
        searchable
        title={intlText('title')}
        store={projectCategoryStore!}
        columns={columns}
        schema={projectCategorySchema}
        defaultValues={projectCategoryTemplate}
        renderActions={(e: Category) => (
          <ActionButtons
            archiveAction={!e.archived ? () => projectCategoryStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => projectCategoryStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'name'} label={intlText('general.name', true)} />
            <DimeField component={SwitchField} name={'archived'} label={intlText('general.is_archived', true)} />
          </>
        )}
      />
    );
  }
}
