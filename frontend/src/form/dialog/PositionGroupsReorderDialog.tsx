import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DragHandle } from '../../layout/icons';
import { PositionGroupStore } from '../../stores/positionGroupStore';
import { PositionGroup } from '../../types';
import compose from '../../utilities/compose';
import { localizeSchema } from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DraggableTableBody } from '../../views/invoices/DraggableTableBody';
import { TextField } from '../fields/common';
import { DimeField } from '../fields/formik';
import { FormDialog } from './FormDialog';

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
