import { DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import { Formik, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import {ProjectCommentPresetSelect} from '../../form/entitySelect/ProjectCommentPresetSelect';
import { ProjectPositionSelect } from '../../form/entitySelect/ProjectPositionSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { DimeDatePickerField, DimeField } from '../../form/fields/formik';
import { DateFastPicker } from '../../form/fields/timetrack/DateFastPicker';
import { EffortValueField } from '../../form/fields/timetrack/EffortValueField';
import { FormikSubmitDetector } from '../../form/FormikSubmitDetector';
import BlackButton from '../../layout/BlackButton';
import { apiDateFormat } from '../../stores/apiStore';
import { EffortStore } from '../../stores/effortStore';
import { MainStore } from '../../stores/mainStore';
import {ProjectCommentPresetStore} from '../../stores/projectCommentPresetStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { ProjectStore } from '../../stores/projectStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectComment, ProjectEffort, ProjectEffortTemplate } from '../../types';
import compose from '../../utilities/compose';
import { captureException } from '../../utilities/helpers';
import { dimeDate, localizeSchema, requiredNumber, selector } from '../../utilities/validation';
import { withFullScreen } from '../../utilities/withFullScreen';

interface Props {
  onClose: () => void;
  effortStore?: EffortStore;
  mainStore?: MainStore;
  projectCommentStore?: ProjectCommentStore;
  projectCommentPresetStore?: ProjectCommentPresetStore;
  timetrackFilterStore?: TimetrackFilterStore;
  projectStore?: ProjectStore;
  intl?: IntlShape;
  fullScreen?: boolean;
}

interface State {
  lastEntry?: ProjectEffortTemplate | ProjectEffort;
  closeAfterSubmit: boolean;
}

const baseEffortFields = {
  comment: yup.string().nullable(true),
  project_id: selector(),
  position_id: selector(),
  date: dimeDate().required(),
  value: requiredNumber(),
};

const soloSchema = localizeSchema(() =>
  yup
    .object({
      employee_id: yup.number().required(),
    })
    .shape(baseEffortFields),
);

const multiSchema = localizeSchema(() =>
  yup
    .object({
      employee_ids: yup
        .array()
        .of(yup.number())
        .min(1, 'validation.schema.field_required'),
    })
    .shape(baseEffortFields),
);

@compose(
  injectIntl,
  inject('effortStore', 'projectStore', 'mainStore', 'projectCommentStore', 'projectCommentPresetStore', 'timetrackFilterStore'),
  observer,
  withFullScreen,
)
export class TimetrackFormDialog extends React.Component<Props, State> {

  get mode() {
    return Boolean(this.props.effortStore!.effort) ? 'edit' : 'create';
  }
  state = {
    lastEntry: undefined,
    closeAfterSubmit: false,
  };

  componentDidMount(): void {
    Promise.all([
      this.props.projectCommentPresetStore!.fetchAll(),
    ]);
  }

  handleSubmit = async (entity: ProjectEffort | ProjectEffortTemplate, formikProps: FormikProps<ProjectEffort>) => {
    const filter = this.props.timetrackFilterStore!.filter;
    const effortStore = this.props.effortStore!;

    if (effortStore.effort && 'employee_id' in entity) {
      await effortStore.put(soloSchema.cast(entity));
    } else if ('employee_ids' in entity) {
      await Promise.all([
        this.widenFilterSettings(entity),
        ...entity.employee_ids.map((e: number) => {
          const newEffort = { employee_id: e, ...entity, date: entity.date.format(apiDateFormat) } as ProjectEffort;
          return effortStore.post(soloSchema.cast(newEffort));
        }),
      ]);
    }

    if ('comment' in entity && entity.comment != null && entity.comment !== '') {
      const newProjectComment: ProjectComment = {
        ...entity,
        date: entity.date.format(apiDateFormat),
      } as ProjectComment;
      await this.props.projectCommentStore!.post(newProjectComment);
      await this.props.projectCommentStore!.fetchWithProjectEffortFilter(filter);
    }

    await effortStore.fetchWithProjectEffortFilter(filter);
    formikProps.setSubmitting(false);
    this.setState({ lastEntry: entity });
    if (this.state.closeAfterSubmit) {
      this.props.effortStore!.editing = false;
    }
  }
  handleSubmitAndErrors = async (entity: ProjectEffort | ProjectEffortTemplate, formikProps: FormikProps<ProjectEffort>) => {
      try {
        await this.handleSubmit(entity, formikProps);
      } catch (e) {
        // allow the user to try again without having to re-enter everything.
        formikProps.setSubmitting(false);
      }
  }

  handleClose = (props: FormikProps<ProjectEffort>) => () => {
    if (props.dirty) {
      if (confirm('Die Änderungen wurden noch nicht gespeichert. Verwerfen?')) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }

  render() {
    const intl = this.props.intl!;
    return (
      <Formik
        initialValues={this.state.lastEntry || this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        validateOnMount={false}
        enableReinitialize
        onSubmit={this.handleSubmitAndErrors}
        validationSchema={this.mode === 'edit' ? soloSchema : multiSchema}
      >
        {(formikProps: FormikProps<ProjectEffort>) => (
          <FormikSubmitDetector {...formikProps}>
            <Dialog open onClose={this.handleClose(formikProps)} fullScreen={this.props.fullScreen!} maxWidth="lg">
              <DialogTitle>
                <FormattedMessage id={'view.timetrack.form_dialog.' + (formikProps.values.id ? 'edit_effort' : 'record_effort')} />
              </DialogTitle>

              <DialogContent>
                {!formikProps.values.id && (
                  <DimeField isMulti component={EmployeeSelect} name={'employee_ids'} label={intl.formatMessage({id: 'general.employee'})} />
                )}
                {formikProps.values.id && <DimeField component={EmployeeSelect} name={'employee_id'} label={intl.formatMessage({id: 'general.employee'})} />}
                <DimeField component={ProjectSelect} name={'project_id'} label={intl.formatMessage({id: 'general.project'})} />
                <DimeField
                  projectId={formikProps.values.project_id}
                  component={ProjectPositionSelect}
                  name={'position_id'}
                  label={intl.formatMessage({id: 'general.service'})}
                  maxMenuHeight={200}
                />
                <DimeDatePickerField component={DateFastPicker} name={'date'} label={intl.formatMessage({id: 'general.date'})} />
                {formikProps.values.project_id && formikProps.values.position_id && (
                  <>
                    <DimeField component={EffortValueField} positionId={formikProps.values.position_id} name={'value'} label={intl.formatMessage({id: 'general.value'})} />
                    {!formikProps.values.id && (
                      <DimeField component={ProjectCommentPresetSelect} name={'comment'} label={intl.formatMessage({id: 'view.timetrack.form_dialog.comment_label'})} />
                    )}
                  </>
                )}
              </DialogContent>

              <DialogActions>
                <BlackButton onClick={this.handleClose(formikProps)}>
                  <FormattedMessage id={'general.action.cancel'} />
                </BlackButton>
                <BlackButton
                  onClick={() => this.setState({ closeAfterSubmit: true }, formikProps.submitForm)}
                  disabled={formikProps.isSubmitting}
                >
                  <FormattedMessage id={'general.action.save'} />
                </BlackButton>
                {!formikProps.values.id && (
                  <BlackButton
                    onClick={() => this.setState({ closeAfterSubmit: false }, formikProps.submitForm)}
                    disabled={formikProps.isSubmitting}
                  >
                    <FormattedMessage id={'general.action.save_and_continue'} />
                  </BlackButton>
                )}
              </DialogActions>
            </Dialog>
          </FormikSubmitDetector>
        )}
      </Formik>
    );
  }

  // widen the filter so the newly added entities are displayed
  private widenFilterSettings = async (entity: ProjectEffortTemplate) => {
    const filter = this.props.timetrackFilterStore!.filter;

    if (filter.employeeIds.length > 0) {
      const allIds = new Set(filter.employeeIds);
      entity.employee_ids.forEach(id => allIds.add(id));
      filter.employeeIds = Array.from(allIds.values());
    }

    if (filter.projectIds.length > 0) {
      const allIds = new Set(filter.projectIds);
      allIds.add(entity.project_id!);
      filter.projectIds = Array.from(allIds.values());
    }

    if (filter.serviceIds.length > 0) {
      try {
        await this.props.projectStore!.fetchOne(entity.project_id!);
        const position = this.props.projectStore!.project!.positions.find(pos => pos.id === entity.position_id)!;
        const allIds = new Set(filter.serviceIds);
        allIds.add(position.service_id);
        filter.serviceIds = Array.from(allIds.values());
      } catch (e) {
        captureException(e);
      }
    }

    const effortDate = moment(entity.date);
    const filterEnd = moment(filter.end);
    const filterStart = moment(filter.start);

    if (effortDate.isAfter(filterEnd)) {
      filter.end = effortDate.clone();
    }

    if (effortDate.isBefore(filterStart)) {
      filter.start = effortDate.clone();
    }
  }
}
