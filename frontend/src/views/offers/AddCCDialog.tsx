import {FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import {FormDialog} from '../../form/dialog/FormDialog';
import CostgroupSelect from '../../form/entitySelect/CostgroupSelect';
import {ProjectCategorySelect} from '../../form/entitySelect/ProjectCategorySelect';
import {ProjectSelect} from '../../form/entitySelect/ProjectSelect';
import {DimeField} from '../../form/fields/formik';
import {OfferStore} from '../../stores/offerStore';
import {ProjectStore} from '../../stores/projectStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {localizeSchema, nullableNumber, selector} from '../../utilities/validation';

const schema = localizeSchema(() =>
  yup.object({
    costgroup: selector(),
    category: selector(),
  }),
);

const template = {
  costgroup: '',
  category: '',
};

type Values = typeof template;

interface Props {
  offerStore?: OfferStore;
  projectStore?: ProjectStore;
  onClose: () => void;
  onConfirm: (costgroup: number, category: number) => void;
}

@inject('offerStore', 'projectStore')
@observer
export default class AddCCDialog extends React.Component<Props> {
  handleSubmit = async (formValues: Values) => {
    const values = schema.cast(formValues);
    this.props.onConfirm(values.costgroup, values.category);
    this.props.onClose();
  }

  render() {

    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={'Kostenstelle und Tätigkeitsbereich hinzufügen'}
        initialValues={{
          costgroup: '',
          category: '',
        }}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        confirmText={'Projekt erstellen'}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <p>
              Bevor ein Projekt erstellt werden kann, muss zuerst eine Kostenstelle und ein Tätigkeitsbereich
              angegeben werden.
            </p>
            <DimeField component={CostgroupSelect} name={'costgroup'} label={'Kostenstelle'} />
            <DimeField component={ProjectCategorySelect} name="category" label={'Tätigkeitsbereich'} />
          </>
        )}
      />
    );
  }
}
