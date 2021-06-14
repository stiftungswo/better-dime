import * as React from 'react';
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

export const ActionButtons = (props: ActionProps) => (
  <div style={{ whiteSpace: 'nowrap' }}>
    {props.copyAction && <ActionButton icon={CopyIcon} action={props.copyAction} title={'Duplizieren'} />}
    {props.editAction && <ActionButton icon={EditIcon} action={props.editAction} title={'Bearbeiten'} />}
    {props.archiveAction && <ActionButton icon={ArchiveIcon} action={props.archiveAction} title={'Archivieren'} />}
    {props.restoreAction && <ActionButton icon={RestoreIcon} action={props.restoreAction} title={'Un-Archivieren'} />}
    {props.deleteAction && <ConfirmationButton onConfirm={props.deleteAction} message={props.deleteMessage} />}
  </div>
);
