import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {FormikProps} from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import * as yup from 'yup';
import { PositionGroupStore } from '../../stores/positionGroupStore';
import {PositionGroup, PositionGroupings, Service} from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup} from '../../utilities/helpers';
import { localizeSchema } from '../../utilities/validation';
import {PositionGroupSelect} from '../entitySelect/PositionGroupSelect';
import { ServiceSelect } from '../entitySelect/ServiceSelect';
import { TextField } from '../fields/common';
import {DimeField} from '../fields/formik';
import { FormDialog } from './FormDialog';

const schema = localizeSchema(() =>
  yup.object({
    oldGroupName: yup.string().nullable(true).test(
      'non-default',
      'Die Gruppe "Generell" kann nicht unbenannt werden',
      (oldGroupName) => oldGroupName && oldGroupName !== defaultPositionGroup().name,
    ),
    newGroupName: yup.string().nullable(true).test(
      'non-empty',
      'Name darf nicht leer sein',
      (newGroupName) => !!newGroupName,
    ).test(
      'non-duplicate',
      'Name bereits in Verwendung',
      function(newGroupName: any[]) {
        return !this.parent.curGroupNames.some((e: any) => e === newGroupName);
      },
    ),
    curGroupNames: yup.mixed(),
  }),
);

interface Values {
  oldGroupName: string;
  newGroupName: string;
  curGroupNames: string[]; // used for validation
}

interface Props {
  open: boolean;
  onClose: () => void;
  positionGroupStore?: PositionGroupStore;
  onSubmit: (groupName: string, newName: string) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

@compose(
  inject('positionGroupStore'),
  observer,
)
export class PositionGroupRenameDialog extends React.Component<Props> {
  componentDidMount(): void {
    this.setState({positionGroupName: this.props.groupName, newName: ''});
  }

  handleSubmit = async (formValues: Values) => {
    this.props.positionGroupStore!.notifyProgress(async () => {
     const values = schema.cast(formValues);
     this.props.onSubmit(values.oldGroupName!, values.newGroupName!);
     this.props.onClose();
    });
  }

  render() {
    const names = [
      ...this.props.groupingEntity!.position_groupings.map((e: PositionGroup) => e.name),
      defaultPositionGroup().name,
    ];
    // the default group is not stored in the DB, so it can't be renamed.
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title="Servicegruppe umbenennen"
        confirmText="umbenennen"
        initialValues={{oldGroupName: this.props.groupName, newGroupName: '', curGroupNames: names}}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <>
            {this.props.groupingEntity && (
              <Box>
                <DimeField
                  name={'oldGroupName'}
                  component={PositionGroupSelect}
                  creatable={false}
                  label={'Service Gruppe'}
                  groupingEntity={this.props.groupingEntity!}
                  placeholder={this.props.placeholder}
                />
              </Box>
            )}
            <DimeField
              name={'newGroupName'}
              component={TextField}
              label={'Neuer Name'}
            />
          </>
        )}
      />
    );
  }
}
