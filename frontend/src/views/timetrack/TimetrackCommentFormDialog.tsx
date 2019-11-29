import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import {ProjectCommentPresetSelect} from '../../form/entitySelect/ProjectCommentPresetSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeField } from '../../form/fields/formik';
import { FormDialog } from '../../form/FormDialog';
import { MainStore } from '../../stores/mainStore';
import {ProjectCommentPresetStore} from '../../stores/projectCommentPresetStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectComment } from '../../types';
import compose from '../../utilities/compose';
import { dimeDate, localizeSchema, selector } from '../../utilities/validation';

interface Props {
  onClose: () => void;
  projectCommentStore?: ProjectCommentStore;
  projectCommentPresetStore?: ProjectCommentPresetStore;
  mainStore?: MainStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

const schema = localizeSchema(() =>
  yup.object({
    comment: yup.string().required(),
    date: dimeDate(),
    project_id: selector(),
  }),
);

@compose(
  inject('projectCommentStore', 'projectCommentPresetStore', 'timetrackFilterStore', 'mainStore'),
  observer,
)
export class TimetrackCommentFormDialog extends React.Component<Props> {
  handleSubmit = async (entity: ProjectComment) => {
    const projectCommentStore = this.props.projectCommentStore!;
    if (projectCommentStore.entity) {
      await projectCommentStore.put(schema.cast(entity));
    } else {
      await projectCommentStore.post(schema.cast(entity));
      await this.widenFilterSettings(entity);
    }
    await projectCommentStore.fetchWithProjectEffortFilter(this.props.timetrackFilterStore!.filter);
    projectCommentStore.editing = false;
  }

  componentDidMount(): void {
    Promise.all([
      this.props.projectCommentPresetStore!.fetchAll(),
    ]);
  }

  render() {
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={'Projekt-Kommentar erfassen'}
        initialValues={this.props.projectCommentStore!.projectComment || this.props.projectCommentStore!.projectCommentTemplate!}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={() => (
          <>
            <DimeField component={DatePicker} name={'date'} label={'Datum'} />
            <DimeField component={ProjectSelect} name={'project_id'} label={'Projekt'} />
            <DimeField component={ProjectCommentPresetSelect} name={'comment'} label={'Kommentar'} multiline rowsMax={6} />
          </>
        )}
      />
    );
  }

  // widen the filter so the newly added entities are displayed
  private widenFilterSettings = async (entity: ProjectComment) => {
    const filter = this.props.timetrackFilterStore!.filter;

    this.props.timetrackFilterStore!.grouping = 'project';

    if (filter.projectIds.length > 0) {
      const allIds = new Set(filter.projectIds);
      allIds.add(entity.project_id!);
      filter.projectIds = Array.from(allIds.values());
    }

    const commentDate = moment(entity.date);
    const filterEnd = moment(filter.end);
    const filterStart = moment(filter.start);

    if (commentDate.isAfter(filterEnd)) {
      filter.end = commentDate.clone();
    }

    if (commentDate.isBefore(filterStart)) {
      filter.start = commentDate.clone();
    }
  }
}
