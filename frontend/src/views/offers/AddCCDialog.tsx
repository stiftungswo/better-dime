import {FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import {FormDialog} from '../../form/dialog/FormDialog';
import CostgroupSelect from '../../form/entitySelect/CostgroupSelect';
import {ProjectCategorySelect} from '../../form/entitySelect/ProjectCategorySelect';
import {ProjectSelect} from '../../form/entitySelect/ProjectSelect';
import {DimeField} from '../../form/fields/formik';
import {OfferStore} from '../../stores/offerStore';
import {ProjectStore} from '../../stores/projectStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import compose from '../../utilities/compose';
import {localizeSchema, nullableNumber, selector} from '../../utilities/validation';
import wrapIntl from '../../utilities/wrapIntl';

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
  intl?: IntlShape;
  onClose: () => void;
  onConfirm: (costgroup: number, category: number) => void;
}
@compose(
  injectIntl,
  inject('offerStore', 'projectStore'),
  observer,
)
export default class AddCCDialog extends React.Component<Props> {
  handleSubmit = async (formValues: Values) => {
    const values = schema.cast(formValues);
    this.props.onConfirm(values.costgroup, values.category);
    this.props.onClose();
  }

  render() {
    const intl = this.props.intl!;
    const intlText = wrapIntl(intl, 'view.offer.addcc_dialog');

    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={intlText('title')}
        initialValues={{
          costgroup: '',
          category: '',
        }}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        confirmText={intlText('confirm_text')}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <p>
              Bevor ein Projekt erstellt werden kann, muss zuerst eine Kostenstelle und ein Tätigkeitsbereich
              angegeben werden.
            </p>
            <DimeField component={CostgroupSelect} name={'costgroup'} label={intlText('cost_group')} />
            <DimeField component={ProjectCategorySelect} name="category" label={intlText('category')} />
          </>
        )}
      />
    );
  }
}
