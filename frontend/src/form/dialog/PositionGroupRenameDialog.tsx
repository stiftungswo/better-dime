import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import { PositionGroupStore } from '../../stores/positionGroupStore';
import { PositionGroup, PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { localizeSchema } from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';
import { TextField } from '../fields/common';
import { DimeField } from '../fields/formik';
import { FormDialog } from './FormDialog';
import { resolveNewGroupName } from './PositionMoveDialog';

const schema = localizeSchema(() =>
  yup.object({
    oldGroupName: yup.string().nullable(true),
    newGroupName: yup.string().nullable(true),
  }),
);

interface Values {
  oldGroupName: string;
  newGroupName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  positionGroupStore?: PositionGroupStore;
  intl?: IntlShape;
  onSubmit: (groupName: string, newName: number | null) => void;
  groupingEntity: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

@compose(
 injectIntl,
  inject('positionGroupStore'),
  observer,
)
export class PositionGroupRenameDialog extends React.Component<Props> {
  handleSubmit = async (formValues: Values) => {
    this.props.positionGroupStore!.notifyProgress(async () => {
      const values = schema.cast(formValues);
      const groupId = await resolveNewGroupName(values.newGroupName!, this.props.groupingEntity, this.props.positionGroupStore);
      this.props.onSubmit(values.oldGroupName!, groupId);
      this.props.onClose();
    });
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.position_group_rename');
    const names = [
      ...this.props.groupingEntity.position_groupings.map((e: PositionGroup) => e.name),
      defaultPositionGroup().name,
    ];
    // the default group is not stored in the DB, so it can't be renamed.
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={intlText('title')}
        confirmText={intlText('general.action.move', true)}
        initialValues={{oldGroupName: this.props.groupName, newGroupName: ''}}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <>
            <Box>
              <DimeField
                name={'oldGroupName'}
                component={PositionGroupSelect}
                creatable={false}
                label={intlText('service_group')}
                groupingEntity={this.props.groupingEntity}
                placeholder={this.props.placeholder}
              />
            </Box>
            <DimeField
              name={'newGroupName'}
              component={PositionGroupSelect}
              creatable={true}
              label={intlText('move_to')}
              groupingEntity={this.props.groupingEntity}
              placeholder={this.props.placeholder}
            />
          </>
        )}
      />
    );
  }
}
