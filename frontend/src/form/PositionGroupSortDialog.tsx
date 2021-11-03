import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {AbstractStore} from '../stores/abstractStore';
import { ServiceStore } from '../stores/serviceStore';
import {PositionGroupings, Service} from '../types';
import compose from '../utilities/compose';
import {defaultPositionGroup} from '../utilities/helpers';
import {PositionGroupSelect} from './entitySelect/PositionGroupSelect';
import { ServiceSelect } from './entitySelect/ServiceSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  serviceStore?: ServiceStore;
  onSubmit: (groupName: string | null) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@compose(
  inject('serviceStore'),
  observer,
)
export class PositionGroupSortDialog extends React.Component<Props> {
  state = {
    positionGroupName: defaultPositionGroup().name,
  };

  componentDidMount(): void {
    this.setState({positionGroupName: this.props.groupName});
  }

  handleSubmit = () => {
    this.props.serviceStore!.notifyProgress(async () => {
      this.props.onSubmit(this.state.positionGroupName);
      this.props.onClose();
    });
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="lg">
        <DialogTitle>Services automatisiert umsortieren?</DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {this.props.groupingEntity && (
            <PositionGroupSelect
              creatable={false}
              label={'Service Gruppe'}
              groupingEntity={this.props.groupingEntity!}
              placeholder={this.props.placeholder}
              value={this.state.positionGroupName}
              onChange={positionGroupName => this.setState({ positionGroupName })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit}>
            Umsortieren
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
