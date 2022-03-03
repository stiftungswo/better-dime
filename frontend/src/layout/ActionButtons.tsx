import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ActionButton, ActionButtonAction } from './ActionButton';
import { ConfirmationButton } from './ConfirmationDialog';
import { ArchiveIcon, CopyIcon, EditIcon, RestoreIcon } from './icons';

interface ActionProps {
  copyAction?: ActionButtonAction;
  editAction?: ActionButtonAction;
  archiveAction?: ActionButtonAction;
  deleteAction?: () => void;
  deleteMessage?: string;
  restoreAction?: ActionButtonAction;
}

export const ActionButtons = (props: ActionProps) => {
  const intl = useIntl();
  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      {props.copyAction && <ActionButton icon={CopyIcon} action={props.copyAction} title={intl.formatMessage({id: 'general.action.duplicate'})} />}
      {props.editAction && <ActionButton icon={EditIcon} action={props.editAction} title={intl.formatMessage({id: 'general.action.edit'})} />}
      {props.archiveAction && <ActionButton icon={ArchiveIcon} action={props.archiveAction} title={intl.formatMessage({id: 'general.action.archive'})} />}
      {props.restoreAction && <ActionButton icon={RestoreIcon} action={props.restoreAction} title={intl.formatMessage({id: 'general.action.dearchive'})} />}
      {props.deleteAction && <ConfirmationButton onConfirm={props.deleteAction} message={props.deleteMessage} />}
    </div>
  );
};
