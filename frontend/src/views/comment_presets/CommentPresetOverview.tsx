import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ProjectCommentPresetStore } from '../../stores/projectCommentPresetStore';
import { ProjectCommentPreset } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { commentPresetSchema, commentPresetTemplate } from './commentPresetSchema';

interface Props {
  projectCommentPresetStore?: ProjectCommentPresetStore;
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('projectCommentPresetStore', 'mainStore'),
  observer,
)
export default class CommentPresetOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.comment_preset.overview');
    const projectCommentPresetStore = this.props.projectCommentPresetStore;

    const columns: Array<Column<ProjectCommentPreset>> = [
      {
        id: 'comment_preset',
        numeric: false,
        label: intlText('general.name', true),
      },
    ];

    return (
      <EditableOverview
        searchable
        paginated
        title={intlText('title')}
        store={projectCommentPresetStore!}
        columns={columns}
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
            deleteMessage={intlText('delete_warning')}
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'comment_preset'} label={intlText('comment_preset')} />
          </>
        )}
      />
    );
  }
}
