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
import TableBody from '@material-ui/core/TableBody/TableBody';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { Formatter } from '../../utilities/formatter';
import { DimeTableCell } from '../../layout/DimeTableCell';
import moment from 'moment';

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
  onEffortAdd: () => void;
  onClickEffortRow: (entity: ProjectEffortListing) => void;
  projectCommentStore?: ProjectCommentStore;
  effortStore?: EffortStore;
  timetrackFilterStore?: TimetrackFilterStore;
  formatter?: Formatter;
}

@compose(
  inject('projectCommentStore', 'effortStore', 'timetrackFilterStore', 'formatter'),
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
    const { displayTotal, efforts, entity, onClickEffortRow, projectCommentStore, classes } = this.props;
    const comments = projectCommentStore!.projectComments.filter((comment: ProjectComment) => comment.project_id === entity.id);
    const formatter = this.props.formatter!;

    let joinedForces: (ProjectEffortListing | ProjectComment)[] = efforts;
    joinedForces = joinedForces.concat(comments);
    joinedForces = joinedForces.sort((a, b) => {
      const dateA = moment(a.date);
      const dateB = moment(b.date);
      return dateA.valueOf() - dateB.valueOf();
    });

    if (efforts.length > 0 || comments.length > 0) {
      return (
        <TimetrackExpansionPanel actions={this.projectGroupActions} title={entity.name} displayTotal={displayTotal}>
          <Table>
            <TableHead>
              <TableRow>
                <DimeTableCell>Datum</DimeTableCell>
                <DimeTableCell>Mitarbeiter</DimeTableCell>
                <DimeTableCell>Aktivität</DimeTableCell>
                <DimeTableCell numeric>Gebuchter Wert</DimeTableCell>
                <DimeTableCell numeric />
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
                      <DimeTableCell style={{ fontStyle: 'italic' }}>{formatter.formatDate(e.date)}</DimeTableCell>
                      <DimeTableCell colSpan={3} style={{ fontStyle: 'italic' }}>
                        {e.comment}
                      </DimeTableCell>
                      <DimeTableCell numeric>
                        <span className={'actions'}>
                          <DeleteButton onConfirm={() => this.handleCommentDelete(e.id!)} />
                        </span>
                      </DimeTableCell>
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
                      <DimeTableCell>{formatter.formatDate(e.date)}</DimeTableCell>
                      <DimeTableCell>{e.employee_full_name}</DimeTableCell>
                      <DimeTableCell>
                        {e.position_description ? e.service_name + ' (' + e.position_description + ')' : e.service_name}
                      </DimeTableCell>
                      <DimeTableCell numeric>{formatter.formatRateEntry(e.effort_value, e.rate_unit_factor, e.effort_unit)}</DimeTableCell>
                      <DimeTableCell numeric>
                        <span className={'actions'}>
                          <DeleteButton onConfirm={() => this.handleEffortDelete(e.id!)} />
                        </span>
                      </DimeTableCell>
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
