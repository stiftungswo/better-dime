import { DialogContent, DialogTitle, withMobileDialog } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Formik, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import {ProjectCommentPresetSelect} from '../../form/entitySelect/ProjectCommentPresetSelect';
import { ProjectPositionSelect } from '../../form/entitySelect/ProjectPositionSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { DimeField } from '../../form/fields/formik';
import { DateFastPicker } from '../../form/fields/timetrack/DateFastPicker';
import { EffortValueField } from '../../form/fields/timetrack/EffortValueField';
import { FormikSubmitDetector } from '../../form/FormikSubmitDetector';
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

interface Props {
  onClose: () => void;
  effortStore?: EffortStore;
  mainStore?: MainStore;
  projectCommentStore?: ProjectCommentStore;
  projectCommentPresetStore?: ProjectCommentPresetStore;
  timetrackFilterStore?: TimetrackFilterStore;
  projectStore?: ProjectStore;
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
        .min(1, 'Dies ist ein erforderliches Feld.'),
    })
    .shape(baseEffortFields),
);

@compose(
  inject('effortStore', 'projectStore', 'mainStore', 'projectCommentStore', 'projectCommentPresetStore', 'timetrackFilterStore'),
  observer,
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

    if (effortStore.entity && 'employee_id' in entity) {
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

  render() {// use hooks instead of withMobileDialog()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <Formik
        initialValues={this.state.lastEntry || this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        isInitialValid={true}
        enableReinitialize
        onSubmit={this.handleSubmitAndErrors}
        validationSchema={this.mode === 'edit' ? soloSchema : multiSchema}
        render={(formikProps: FormikProps<ProjectEffort>) => (
          <FormikSubmitDetector {...formikProps}>
            <Dialog open onClose={this.handleClose(formikProps)} fullScreen={fullScreen} maxWidth="lg">
              <DialogTitle>Aufwand {formikProps.values.id ? 'bearbeiten' : 'erfassen'}</DialogTitle>

              <DialogContent>
                {!formikProps.values.id && (
                  <DimeField isMulti component={EmployeeSelect} name={'employee_ids'} label={'Mitarbeiter'} />
                )}
                {formikProps.values.id && <DimeField component={EmployeeSelect} name={'employee_id'} label={'Mitarbeiter'} />}
                <DimeField component={ProjectSelect} name={'project_id'} label={'Projekt'} />
                <DimeField
                  projectId={formikProps.values.project_id}
                  component={ProjectPositionSelect}
                  name={'position_id'}
                  label={'Service'}
                  maxMenuHeight={200}
                />
                <DimeField component={DateFastPicker} name={'date'} label={'Datum'} />
                {formikProps.values.project_id && formikProps.values.position_id && (
                  <>
                    <DimeField component={EffortValueField} positionId={formikProps.values.position_id} name={'value'} label={'Wert'} />
                    {!formikProps.values.id && (
                      <DimeField component={ProjectCommentPresetSelect} name={'comment'} label={'Kommentar zu Projekt und Tag'} />
                    )}
                  </>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
                <Button
                  onClick={() => this.setState({ closeAfterSubmit: true }, formikProps.submitForm)}
                  disabled={formikProps.isSubmitting}
                >
                  Speichern
                </Button>
                {!formikProps.values.id && (
                  <Button
                    onClick={() => this.setState({ closeAfterSubmit: false }, formikProps.submitForm)}
                    disabled={formikProps.isSubmitting}
                  >
                    Speichern und weiter
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
