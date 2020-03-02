import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ProjectCommentPresetStore } from '../../stores/projectCommentPresetStore';
import { ProjectCommentPreset } from '../../types';
import compose from '../../utilities/compose';
import { commentPresetSchema, commentPresetTemplate } from './commentPresetSchema';

interface Props {
  projectCommentPresetStore?: ProjectCommentPresetStore;
  mainStore?: MainStore;
}

@compose(
  inject('projectCommentPresetStore', 'mainStore'),
  observer,
)
export default class CommentPresetOverview extends React.Component<Props> {
  columns: Array<Column<ProjectCommentPreset>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'comment_preset',
        numeric: false,
        label: 'Name',
      },
    ];
  }

  render() {
    const projectCommentPresetStore = this.props.projectCommentPresetStore;

    return (
      <EditableOverview
        searchable
        paginated
        title={'Kommentarvorlagen'}
        store={projectCommentPresetStore!}
        columns={this.columns}
        schema={commentPresetSchema}
        defaultValues={commentPresetTemplate}
        onSubmit={async (entity) => {
          if (projectCommentPresetStore!.entity) {
            await projectCommentPresetStore!.put(entity).then(() => this.setState({ editing: false }));
          } else {
            await projectCommentPresetStore!.post(entity).then(() => this.setState({ editing: false }));
          }
          await projectCommentPresetStore!.fetchAll();
        }}
        renderActions={(e: ProjectCommentPreset) => (
          <ActionButtons
            deleteAction={async () => {
              await projectCommentPresetStore!.delete(e.id!);
              await projectCommentPresetStore!.fetchAll();
            }}
            deleteMessage={
              'Möchtest du diese Kommentarvorlage wirklich löschen?'
            }
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'comment_preset'} label={'Kommentarvorlage'} />
          </>
        )}
      />
    );
  }
}
