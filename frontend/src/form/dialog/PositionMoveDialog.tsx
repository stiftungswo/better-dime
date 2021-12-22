import {ArrayHelpers, FormikProps} from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import {AbstractStore} from '../../stores/abstractStore';
import {MainStore} from '../../stores/mainStore';
import {PositionGroupStore} from '../../stores/positionGroupStore';
import {PositionGroup, PositionGroupings, Project} from '../../types';
import {defaultPositionGroup} from '../../utilities/helpers';
import { localizeSchema, nullableNumber, selector } from '../../utilities/validation';
import {PositionGroupSelect} from '../entitySelect/PositionGroupSelect';
import {DimeField} from '../fields/formik';
import { FormDialog } from './FormDialog';

const schema = localizeSchema(() =>
  yup.object({
    positionGroupName: yup.string().nullable(true),
  }),
);

const template = {
  positionGroupName: '',
};

type Values = typeof template;

interface Props {
  mainStore?: MainStore;
  positionIndex: number;
  positionGroupStore?: PositionGroupStore;
  groupingEntity: PositionGroupings<any>;
  onClose: () => void;
  onUpdate: (positionIndex: number, newGroupId: number | null) => void;
  placeholder?: string;
}

export async function resolveNewGroupName(newGroupName: string | null, groupingEntity: PositionGroupings<any>, positionGroupStore?: PositionGroupStore): Promise<number | null> {
  const positionGroupName = newGroupName ? newGroupName : '';
  const group = [defaultPositionGroup(), ...groupingEntity.position_groupings].find((e: PositionGroup) => {
    return e.name.toLowerCase() === positionGroupName.toLowerCase();
  });

  if (group == null && positionGroupName != null && positionGroupName.length > 0) {
    // create a new group. This is done only here to avoid creating useless groups.
    return positionGroupStore!.post({name: positionGroupName}).then(nothing => {
      groupingEntity.position_groupings.push({
        id: positionGroupStore!.positionGroup!.id,
        name: positionGroupName,
      });
      return positionGroupStore!.positionGroup!.id!;
    });
  } else if (group != null && group.id != null) {
    // prexisting named groups
    return group.id;
  } else {
    // default group?
    return null;
  }
}

@inject('positionGroupStore', 'mainStore')
@observer
export default class PositionMoveDialog extends React.Component<Props> {
  handleSubmit = async (formValues: Values) => {
    const values = schema.cast(formValues);
    resolveNewGroupName(values.positionGroupName, this.props.groupingEntity, this.props.positionGroupStore).then(groupId => {
      this.props.onUpdate(this.props.positionIndex, groupId);
    });
    this.props.onClose();
  }

  render() {
    const placeholder = this.props.placeholder;

    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title="Service verschieben"
        initialValues={template}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <DimeField
              component={PositionGroupSelect}
              groupingEntity={this.props.groupingEntity}
              placeholder={placeholder}
              name={'positionGroupName'}
              label={'Position Group Select'}
            />
          </>
        )}
      />
    );
  }
}
