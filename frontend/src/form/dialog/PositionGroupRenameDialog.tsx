import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { PositionGroupStore } from '../../stores/positionGroupStore';
import {PositionGroup, PositionGroupings, Service} from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup} from '../../utilities/helpers';
import {PositionGroupSelect} from '../entitySelect/PositionGroupSelect';
import { ServiceSelect } from '../entitySelect/ServiceSelect';
import { DimeInputField } from '../fields/common';

interface Props {
  open: boolean;
  onClose: () => void;
  positionGroupStore?: PositionGroupStore;
  onSubmit: (groupName: string, newName: string) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@compose(
  inject('positionGroupStore'),
  observer,
)
export class PositionGroupRenameDialog extends React.Component<Props> {
  state = {
    positionGroupName: defaultPositionGroup().name,
    newName: '',
  };

  componentDidMount(): void {
    this.setState({positionGroupName: this.props.groupName, newName: ''});
  }

  handleSubmit = () => {
    this.props.positionGroupStore!.notifyProgress(async () => {
      this.props.onSubmit(this.state.positionGroupName, this.state.newName);
      this.props.onClose();
    });
  }

  validateOldName(): string | undefined {
    if (!this.state.positionGroupName || this.state.positionGroupName === defaultPositionGroup().name) {
      return 'Die Gruppe \'Generell\' kann nicht unbenannt werden';
    }
    return undefined;
  }

  validateNewName(): string | undefined {
    if (!this.state.newName) { return 'Name darf nicht leer sein'; }
    const curGroupNames = [
        ...this.props.groupingEntity!.position_groupings.map((e: PositionGroup) => e.name),
        defaultPositionGroup().name,
    ];
    if (curGroupNames.findIndex(e => e === this.state.newName) >= 0) { return 'Name bereits in Verwendung'; }
    return undefined;
  }

  render() {
    // the default group is not stored in the DB, so it can't be renamed.
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="lg">
        <DialogTitle>Servicegruppe umbenennen?</DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {this.props.groupingEntity && (
            <PositionGroupSelect
              creatable={false}
              label={'Service Gruppe'}
              groupingEntity={this.props.groupingEntity!}
              placeholder={this.props.placeholder}
              value={this.state.positionGroupName}
              onChange={positionGroupName => this.setState({ positionGroupName })}
              errorMessage={this.validateOldName()}
            />
          )}
          <DimeInputField
            label={'Neuer Name'}
            value={this.state.newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ newName: e.target.value })}
            errorMessage={this.validateNewName()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit}>
            Umbenennen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
