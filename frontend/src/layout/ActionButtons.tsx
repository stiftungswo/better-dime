import { ActionButton, ActionButtonAction } from './ActionButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import ArchiveIcon from '@material-ui/icons/Archive';
import { DeleteButton } from './ConfirmationDialog';
import * as React from 'react';

interface ActionProps {
  copyAction?: ActionButtonAction;
  editAction?: ActionButtonAction;
  archiveAction?: ActionButtonAction;
  deleteAction?: () => void;
}

export const ActionButtons = (props: ActionProps) => (
  <>
    {props.copyAction && <ActionButton icon={FileCopyIcon} action={props.copyAction} />}
    {props.editAction && <ActionButton icon={EditIcon} action={props.editAction} />}
    {props.archiveAction && <ActionButton icon={ArchiveIcon} action={props.archiveAction} />}
    {props.deleteAction && <DeleteButton onConfirm={props.deleteAction} />}
  </>
);
