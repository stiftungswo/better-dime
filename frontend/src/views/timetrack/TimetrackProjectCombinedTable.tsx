import React from 'react';
import { ProjectComment, ProjectEffortListing } from '../../types';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';
import { ProjectListing } from '../../stores/projectStore';
import { SafeClickableTableRow } from '../../utilities/SafeClickableTableRow';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { AddCommentIcon, AddEffortIcon } from '../../layout/icons';
import { ActionButton } from '../../layout/ActionButton';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { EffortStore } from '../../stores/effortStore';
import createStyles from '@material-ui/core/styles/createStyles';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody/TableBody';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';

const styles = createStyles({
  hideActions: {
    '@media (hover)': {
      '& .actions': {
        visibility: 'hidden',
      },
      '&:hover .actions': {
        visibility: 'visible',
      },
    },
  },
});

interface Props extends WithStyles<typeof styles> {
  displayTotal: string;
  efforts: ProjectEffortListing[];
  entity: ProjectListing;
  formatRateEntry: (value: number, factor: number | undefined, unit: string) => string;
  onEffortAdd: () => void;
  onClickEffortRow: (entity: ProjectEffortListing) => void;
  projectCommentStore?: ProjectCommentStore;
  effortStore?: EffortStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

@compose(
  inject('projectCommentStore', 'effortStore', 'timetrackFilterStore'),
  observer
)
class TimetrackProjectCombinedTableInner extends React.Component<Props> {
  public handleClickCommentRow = async (entity: ProjectComment | undefined) => {
    if (entity && entity.id) {
      await this.props.projectCommentStore!.fetchOne(entity.id);
      this.props.projectCommentStore!.editing = true;
    }
  };

  public handleProjectCommentAdd = () => {
    this.props.projectCommentStore!.projectCommentTemplate!.project_id = this.props.entity.id;
    this.props.projectCommentStore!.editing = true;
  };

  public handleEffortDelete = async (id: number) => {
    await this.props.effortStore!.delete(id);
    await this.props.effortStore!.fetchFiltered(this.props.timetrackFilterStore!.filter);
  };

  public handleCommentDelete = async (id: number) => {
    await this.props.projectCommentStore!.delete(id);
    await this.props.projectCommentStore!.fetchFiltered(this.props.timetrackFilterStore!.filter);
  };

  public projectGroupActions = (
    <>
      <ActionButton icon={AddCommentIcon} action={this.handleProjectCommentAdd} title={'Kommentar hinzufügen'} />
      <ActionButton icon={AddEffortIcon} action={this.props.onEffortAdd} title={'Aufwand hinzufügen'} />
    </>
  );

  public render() {
    const { displayTotal, efforts, entity, formatRateEntry, onClickEffortRow, projectCommentStore, classes } = this.props;
    const comments = projectCommentStore!.projectComments.filter((comment: ProjectComment) => comment.project_id === entity.id);

    let joinedForces: (ProjectEffortListing | ProjectComment)[] = efforts;
    joinedForces = joinedForces.concat(comments);
    joinedForces = joinedForces.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    if (efforts.length > 0 || comments.length > 0) {
      return (
        <TimetrackExpansionPanel actions={this.projectGroupActions} title={entity.name} displayTotal={displayTotal}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Mitarbeiter</TableCell>
                <TableCell>Aktivität</TableCell>
                <TableCell numeric>Gebuchter Wert</TableCell>
                <TableCell numeric />
              </TableRow>
            </TableHead>
            <TableBody>
              {joinedForces.map((e: ProjectEffortListing | ProjectComment) => {
                if ('comment' in e) {
                  return (
                    <TableRow
                      hover
                      className={classes.hideActions}
                      key={`comment_${e.id}`}
                      onClick={() => this.handleClickCommentRow(e)}
                      component={SafeClickableTableRow}
                    >
                      <TableCell style={{ fontStyle: 'italic' }}>{e.date}</TableCell>
                      <TableCell colSpan={3} style={{ fontStyle: 'italic' }}>
                        {e.comment}
                      </TableCell>
                      <TableCell numeric>
                        <span className={'actions'}>
                          <DeleteButton onConfirm={() => this.handleCommentDelete(e.id!)} />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow
                      hover
                      className={classes.hideActions}
                      key={`effort_${e.id}`}
                      onClick={() => onClickEffortRow(e)}
                      component={SafeClickableTableRow}
                    >
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.employee_full_name}</TableCell>
                      <TableCell>{e.position_description}</TableCell>
                      <TableCell numeric>{formatRateEntry(e.effort_value, e.rate_unit_factor, e.effort_unit)}</TableCell>
                      <TableCell numeric>
                        <span className={'actions'}>
                          <DeleteButton onConfirm={() => this.handleEffortDelete(e.id!)} />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TimetrackExpansionPanel>
      );
    } else {
      return (
        <TimetrackExpansionPanel actions={this.projectGroupActions} title={entity.name}>
          Keine Leistungen erfasst mit den gewählten Filtern.
        </TimetrackExpansionPanel>
      );
    }
  }
}
export const TimetrackProjectCombinedTable = withStyles(styles)(TimetrackProjectCombinedTableInner);
