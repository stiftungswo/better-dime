import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import { inject, observer } from 'mobx-react';
import { ProjectStore } from '../../stores/projectStore';
import { Field, Form, Formik } from 'formik';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { ProjectPositionSelect } from '../../form/entitySelect/ProjectPositionSelect';
import Grid from '@material-ui/core/Grid/Grid';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import { EffortStore } from '../../stores/effortStore';
import * as yup from 'yup';
import { localizeSchema, nullableNumber, selector } from '../../utilities/validation';
import Button from '@material-ui/core/Button/Button';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { HandleFormikSubmit } from '../../types';

const schema = localizeSchema(() =>
  yup.object({
    project_id: selector(),
    project_position: nullableNumber(),
  })
);

const template = {
  project_id: '',
  project_position: '',
};

type Values = typeof template;

interface Props {
  effortIds: number[];
  projectStore?: ProjectStore;
  effortStore?: EffortStore;
  timetrackFilterStore?: TimetrackFilterStore;
  onClose: () => void;
}

@inject('effortStore', 'projectStore', 'timetrackFilterStore')
@observer
export default class EffortMoveDialog extends React.Component<Props> {
  public handleSubmit: HandleFormikSubmit<Values> = async (formValues, bag) => {
    const values = schema.cast(formValues);
    try {
      await this.props.effortStore!.move(this.props.effortIds, values.project_id, values.project_position);
      await this.props.effortStore!.fetchFiltered(this.props.timetrackFilterStore!.filter);
      this.props.onClose();
    } catch (e) {
      bag.setSubmitting(false);
    }
  };

  public render() {
    return (
      <Dialog open onClose={this.props.onClose}>
        <Formik
          initialValues={template}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
          render={formikProps => (
            <>
              <DialogTitle>{this.props.effortIds.length} Aufwände verschieben</DialogTitle>
              <DialogContent>
                <Form>
                  <Grid container spacing={8}>
                    <Grid item xs={12}>
                      <Field component={ProjectSelect} name="project_id" label={'Projekt'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        projectId={formikProps.values.project_id}
                        component={ProjectPositionSelect}
                        name="project_position"
                        label={'Aktivität'}
                        placeholder={'Beibehalten'}
                      />
                    </Grid>
                  </Grid>
                </Form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose}>Abbrechen</Button>
                <Button onClick={() => formikProps.handleSubmit()} disabled={formikProps.isSubmitting}>
                  Verschieben
                </Button>
              </DialogActions>
            </>
          )}
        />
      </Dialog>
    );
  }
}
