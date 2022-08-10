import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ArrayHelpers, FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DragHandle } from '../../layout/icons';
import { PositionGroupStore } from '../../stores/positionGroupStore';
import { PositionGroup, PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { localizeSchema } from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DraggableTableBody } from '../../views/invoices/DraggableTableBody';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';
import { TextField } from '../fields/common';
import { DimeField } from '../fields/formik';
import { FormDialog } from './FormDialog';
import { resolveNewGroupName } from './PositionMoveDialog';

const schema = localizeSchema(() =>
  yup.object({
    groups: yup.array(),
  }),
);

interface Values {
  groups: PositionGroup[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  positionGroupStore?: PositionGroupStore;
  intl?: IntlShape;
  onSubmit: (groups: PositionGroup[]) => void;
  allGroups: PositionGroup[]; // in sorted order, includes the default group.
}

@compose(
  injectIntl,
  inject('positionGroupStore'),
  observer,
)
export default class PositionGroupRenameDialog extends React.Component<Props> {
  handleSubmit = async (formValues: Values) => {
    this.props.positionGroupStore!.notifyProgress(async () => {
      this.props.onSubmit(formValues.groups);
      this.props.onClose();
    });
  }

  renderTable = (arrayHelpers: FieldArrayRenderProps, values: FormikProps<Values>) => {
    return (
      <>
        <Table size="small">
          <TableHead>
            <TableRow>
              <DimeTableCell/>
              <DimeTableCell>
                <FormattedMessage id="form.dialog.position_groups_reorder.group" />
              </DimeTableCell>
            </TableRow>
          </TableHead>
          <DraggableTableBody
            arrayHelpers={arrayHelpers}
            name={'groups'}
            filterKey={undefined}
            renderRow={({ row, index, provided }) => {
              const name = (fieldName: string) => `groups.${index}.${fieldName}`;
              return (
                <>
                  <DimeTableCell {...provided.dragHandleProps}>
                    <DragHandle />
                  </DimeTableCell>
                  <DimeTableCell>
                    <DimeField delayed component={TextField} name={name('name')} margin={'none'} readOnly />
                  </DimeTableCell>
                </>
              );
            }}
          />
        </Table>
      </>
    );
  }

  render() {
    // the default group is not part of props.positionGroups, so we add it here
    const { allGroups } = this.props;
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.position_groups_reorder');

    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={intlText('title')}
        confirmText={intlText('confirm_text')}
        initialValues={{groups: allGroups}}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <FieldArray
            name={'groups'}
            render={(arrayHelpers: FieldArrayRenderProps) => {
              return this.renderTable(arrayHelpers, formikProps);
            }}
          />
        )}
      />
    );
  }
}
