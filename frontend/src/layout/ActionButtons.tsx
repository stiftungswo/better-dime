import { ActionButton, ActionButtonAction } from './ActionButton';
import { DeleteButton } from './ConfirmationDialog';
import * as React from 'react';
import { ArchiveIcon, CopyIcon, EditIcon, RestoreIcon } from './icons';

interface ActionProps {
  copyAction?: ActionButtonAction;
  editAction?: ActionButtonAction;
  archiveAction?: ActionButtonAction;
  deleteAction?: () => void;
  deleteMessage?: string;
  restoreAction?: ActionButtonAction;
}

export const ActionButtons = (props: ActionProps) => (
  <div style={{ whiteSpace: 'nowrap' }}>
    {props.copyAction && <ActionButton icon={CopyIcon} action={props.copyAction} />}
    {props.editAction && <ActionButton icon={EditIcon} action={props.editAction} />}
    {props.archiveAction && <ActionButton icon={ArchiveIcon} action={props.archiveAction} />}
    {props.restoreAction && <ActionButton icon={RestoreIcon} action={props.restoreAction} />}
    {props.deleteAction && <DeleteButton onConfirm={props.deleteAction} message={props.deleteMessage} />}
  </div>
);
