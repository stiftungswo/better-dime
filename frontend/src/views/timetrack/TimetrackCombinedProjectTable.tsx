import React from 'react';
import { ProjectComment, ProjectEffortListing } from '../../types';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ProjectListing } from '../../stores/projectStore';
import { SafeClickableTableRow } from '../../utilities/SafeClickableTableRow';
import { MainStore } from '../../stores/mainStore';

interface Props {
  comments: ProjectComment[];
  efforts: ProjectEffortListing[];
  entity: ProjectListing;
  formatRateEntry: (value: number, factor: number | undefined, unit: string) => string;
  onClickCommentRow: (entity: ProjectComment | undefined) => void;
  onClickEffortRow: (entity: ProjectEffortListing) => void;
  projectGroupActions: React.ReactNode;
}

export class TimetrackCombinedProjectTable extends React.Component<Props> {
  public render() {
    let joined_forces: (ProjectEffortListing | ProjectComment)[] = this.props.efforts;
    joined_forces = joined_forces.concat(this.props.comments);
    joined_forces = joined_forces.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    if (this.props.efforts.length > 0 || this.props.comments.length > 0) {
      return (
        <TimetrackExpansionPanel actions={this.props.projectGroupActions} title={this.props.entity.name}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Mitarbeiter</TableCell>
                <TableCell>Kategorie der Leistung</TableCell>
                <TableCell numeric>Gebuchter Wert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {joined_forces.map((e: ProjectEffortListing | ProjectComment) => {
                if ('comment' in e) {
                  return (
                    <TableRow key={`comment_${e.id}`} onClick={() => this.props.onClickCommentRow(e)} component={SafeClickableTableRow}>
                      <TableCell style={{ fontStyle: 'italic' }}>{e.date}</TableCell>
                      <TableCell colSpan={3} style={{ fontStyle: 'italic' }}>
                        {e.comment}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={`effort_${e.id}`} onClick={() => this.props.onClickEffortRow(e)} component={SafeClickableTableRow}>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.employee_full_name}</TableCell>
                      <TableCell>{e.position_description}</TableCell>
                      <TableCell numeric>{this.props.formatRateEntry(e.effort_value, e.rate_unit_factor, e.effort_unit)}</TableCell>
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
        <TimetrackExpansionPanel actions={this.props.projectGroupActions} title={this.props.entity.name}>
          Keine Leistungen erfasst mit den gewählten Filtern.
        </TimetrackExpansionPanel>
      );
    }
  }
}
