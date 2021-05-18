import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { Category } from '../../types';
import compose from '../../utilities/compose';
import { projectCategorySchema, projectCategoryTemplate } from './projectCategorySchema';

interface Props {
  mainStore?: MainStore;
  projectCategoryStore?: ProjectCategoryStore;
}

@compose(
  inject('mainStore', 'projectCategoryStore'),
  observer,
)
export default class ProjectCategoryOverview extends React.Component<Props> {
  columns: Array<Column<Category>> = [];

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
    const projectCategoryStore = this.props.projectCategoryStore;

    return (
      <EditableOverview
        archivable
        searchable
        title={'Tätigkeitsbereiche'}
        store={projectCategoryStore!}
        columns={this.columns}
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
            <DimeField component={TextField} name={'name'} label={'Name'} />
            <DimeField component={SwitchField} name={'archived'} label={'Archiviert?'} />
          </>
        )}
      />
    );
  }
}
