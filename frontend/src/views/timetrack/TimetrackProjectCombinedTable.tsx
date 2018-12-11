import React from 'react';
import { ProjectComment, ProjectEffortListing } from '../../types';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ProjectListing } from '../../stores/projectStore';
import { SafeClickableTableRow } from '../../utilities/SafeClickableTableRow';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { AddCommentIcon, AddEffortIcon } from '../../layout/icons';
import { ActionButton } from '../../layout/ActionButton';

interface Props {
  displayTotal: string;
  efforts: ProjectEffortListing[];
  entity: ProjectListing;
  formatRateEntry: (value: number, factor: number | undefined, unit: string) => string;
  onEffortAdd: () => void;
  onClickEffortRow: (entity: ProjectEffortListing) => void;
  projectCommentStore?: ProjectCommentStore;
}

@compose(
  inject('projectCommentStore'),
  observer
)
export class TimetrackProjectCombinedTable extends React.Component<Props> {
  public onClickCommentRow = async (entity: ProjectComment | undefined) => {
    if (entity && entity.id) {
      await this.props.projectCommentStore!.fetchOne(entity.id);
      this.props.projectCommentStore!.editing = true;
    }
  };

  public onProjectCommentAdd = () => {
    this.props.projectCommentStore!.projectCommentTemplate!.project_id = this.props.entity.id;
    this.props.projectCommentStore!.editing = true;
  };

  public projectGroupActions = (
    <>
      <ActionButton icon={AddCommentIcon} action={this.onProjectCommentAdd} title={'Kommentar hinzufügen'} />
      <ActionButton icon={AddEffortIcon} action={this.props.onEffortAdd} title={'Aufwand hinzufügen'} />
    </>
  );

  public render() {
    const { displayTotal, efforts, entity, formatRateEntry, onClickEffortRow, projectCommentStore } = this.props;
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
              </TableRow>
            </TableHead>
            <TableBody>
              {joinedForces.map((e: ProjectEffortListing | ProjectComment) => {
                if ('comment' in e) {
                  return (
                    <TableRow key={`comment_${e.id}`} onClick={() => this.onClickCommentRow(e)} component={SafeClickableTableRow}>
                      <TableCell style={{ fontStyle: 'italic' }}>{e.date}</TableCell>
                      <TableCell colSpan={3} style={{ fontStyle: 'italic' }}>
                        {e.comment}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={`effort_${e.id}`} onClick={() => onClickEffortRow(e)} component={SafeClickableTableRow}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.employee_full_name}</TableCell>
                      <TableCell>{e.position_description}</TableCell>
                      <TableCell numeric>{formatRateEntry(e.effort_value, e.rate_unit_factor, e.effort_unit)}</TableCell>
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
