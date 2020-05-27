import {FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import {ProjectPositionSelect} from '../../form/entitySelect/ProjectPositionSelect';
import {ProjectSelect} from '../../form/entitySelect/ProjectSelect';
import {DimeField} from '../../form/fields/formik';
import {FormDialog} from '../../form/FormDialog';
import {EffortStore} from '../../stores/effortStore';
import {ProjectStore} from '../../stores/projectStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {localizeSchema, nullableNumber, selector} from '../../utilities/validation';

const schema = localizeSchema(() =>
  yup.object({
    project_id: selector(),
    project_position: nullableNumber(),
  }),
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
  handleSubmit = async (formValues: Values) => {
    const values = schema.cast(formValues);

    await this.props.effortStore!.move(this.props.effortIds, values.project_id, values.project_position);
    await this.props.effortStore!.fetchWithProjectEffortFilter(this.props.timetrackFilterStore!.filter);
    this.props.onClose();
  }

  render() {
    const {lastMoveProject, lastMovePosition} = this.props.effortStore!;
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={`${this.props.effortIds.length} Aufwände verschieben`}
        initialValues={{
          project_id: lastMoveProject || '',
          project_position: lastMovePosition || '',
        }}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <DimeField component={ProjectSelect} name={'project_id'} label={'Projekt'} />
            <DimeField
              component={ProjectPositionSelect}
              isClearable
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
