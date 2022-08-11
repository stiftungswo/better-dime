import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { FormikSubmitDetector } from 'src/form/FormikSubmitDetector';
import * as yup from 'yup';
import { FormDialog } from '../../form/dialog/FormDialog';
import {ProjectCommentPresetSelect} from '../../form/entitySelect/ProjectCommentPresetSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { MainStore } from '../../stores/mainStore';
import {ProjectCommentPresetStore} from '../../stores/projectCommentPresetStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectComment } from '../../types';
import compose from '../../utilities/compose';
import { dimeDate, localizeSchema, selector } from '../../utilities/validation';
import { withFullScreen } from '../../utilities/withFullScreen';

interface Props {
  onClose: () => void;
  projectCommentStore?: ProjectCommentStore;
  projectCommentPresetStore?: ProjectCommentPresetStore;
  mainStore?: MainStore;
  timetrackFilterStore?: TimetrackFilterStore;
  intl?: IntlShape;
  fullScreen?: boolean;
}

interface State {
  lastEntry?: ProjectComment;
  closeAfterSubmit: boolean;
}

const schema = localizeSchema(() =>
  yup.object({
    comment: yup.string().nullable(true),
    date: dimeDate(),
    project_id: selector(),
  }),
);

@compose(
  injectIntl,
  inject('projectCommentStore', 'projectCommentPresetStore', 'timetrackFilterStore', 'mainStore'),
  observer,
  withFullScreen,
)
export class TimetrackCommentFormDialog extends React.Component<Props, State> {

  state = {
    lastEntry: undefined,
    closeAfterSubmit: false,
  };

  handleSubmit = async (values: ProjectComment) => {
    const projectCommentStore = this.props.projectCommentStore!;
    if (projectCommentStore.entity && values.id) {
      await projectCommentStore.put(schema.cast(values));
    } else {
      if (schema.cast(values)?.comment != null) {
        await projectCommentStore.post(schema.cast(values));
        await this.widenFilterSettings(values);
      }
    }
    await projectCommentStore.fetchWithProjectEffortFilter(this.props.timetrackFilterStore!.filter);
    this.setState({ lastEntry: values });
    if (this.state.closeAfterSubmit) {
      projectCommentStore.editing = false;
    }
  }

  handleClose = () => () => {
   this.props.onClose();
  }

  componentDidMount(): void {
    Promise.all([
      this.props.projectCommentPresetStore!.fetchAll(),
    ]);
  }

  render() {
    const fullScreen = this.props.fullScreen!;
    const intl = this.props.intl!;

    return (
      <FormDialog
        initialValues={this.state.lastEntry || this.props.projectCommentStore!.projectComment || this.props.projectCommentStore!.projectCommentTemplate!}
        validateOnMount={false}
        validationSchema={schema}
        enableReinitialize
        title={'invisible pink elephants'}
        open
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        fullScreen={fullScreen}
        render={(formikProps: FormikProps<ProjectComment>) => (
          <FormikSubmitDetector {...formikProps}>
            <Dialog open fullScreen={fullScreen} maxWidth="lg">
              <DialogTitle>
                <FormattedMessage id={'view.timetrack.comment_form_dialog.' + (formikProps.values.id ? 'edit_comment' : 'record_comment')} />
              </DialogTitle>
              <DialogContent>
                <DimeDatePickerField component={DatePicker} name={'date'} label={intl.formatMessage({id: 'general.date'})} />
                <DimeField component={ProjectSelect} name={'project_id'} label={intl.formatMessage({id: 'general.project'})} />
                <DimeField component={ProjectCommentPresetSelect} name={'comment'} label={intl.formatMessage({id: 'general.comment'})} />
              </DialogContent>

              <DialogActions>
                <Button onClick={this.handleClose()}>
                  <FormattedMessage id={'general.action.cancel'} />
                </Button>
                <Button
                  onClick={() => this.setState({ closeAfterSubmit: true }, formikProps.submitForm)}
                  disabled={formikProps.isSubmitting}
                >
                  <FormattedMessage id={'general.action.save'} />
                </Button>
                {!formikProps.values.id && (
                  <Button
                    onClick={() => this.setState({ closeAfterSubmit: false }, formikProps.submitForm)}
                    disabled={formikProps.isSubmitting}
                  >
                    <FormattedMessage id={'general.action.save_and_continue'} />
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </FormikSubmitDetector>
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
