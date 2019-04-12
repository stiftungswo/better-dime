import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import { inject, observer } from 'mobx-react';
import { ProjectStore } from '../../stores/projectStore';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
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
import { DimeField } from '../../form/fields/formik';
import { FormDialog } from '../../form/FormDialog';

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
  public handleSubmit = async (formValues: Values) => {
    const values = schema.cast(formValues);

    await this.props.effortStore!.move(this.props.effortIds, values.project_id, values.project_position);
    await this.props.effortStore!.fetchFiltered(this.props.timetrackFilterStore!.filter);
    this.props.onClose();
  };

  public render() {
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={`${this.props.effortIds.length} Aufwände verschieben`}
        initialValues={template}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <DimeField component={ProjectSelect} name={'project_id'} label={'Projekt'} />
            <DimeField
              component={ProjectPositionSelect}
              projectId={formikProps.values.project_id}
              name="project_position"
              label={'Aktivität'}
              placeholder={'Beibehalten'}
            />
          </>
        )}
      />
    );
  }
}
