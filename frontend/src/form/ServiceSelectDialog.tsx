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
  onSubmit: (service: Service, groupName: string | null) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

@compose(
  inject('serviceStore'),
  observer,
)
export class ServiceSelectDialog extends React.Component<Props> {
  state = {
    serviceId: null,
    positionGroupName: defaultPositionGroup().name,
  };

  componentDidMount(): void {
    this.setState({positionGroupName: this.props.groupName});
  }

  handleSubmit = () => {
    this.props.serviceStore!.notifyProgress(async () => {
      const service = (await this.props.serviceStore!.fetchOne(this.state.serviceId!)) as Service;
      if (this.state.positionGroupName != null) {
        this.props.onSubmit(service, this.state.positionGroupName);
      } else {
        this.props.onSubmit(service, null);
      }
      this.props.onClose();
    });
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle>Service hinzufügen</DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {this.props.groupingEntity && (
            <PositionGroupSelect
              label={'Service Gruppe'}
              groupingEntity={this.props.groupingEntity!}
              placeholder={this.props.placeholder}
              value={this.state.positionGroupName}
              onChange={positionGroupName => this.setState({ positionGroupName })}
            />
          )}
          <ServiceSelect<number> label={'Service'} value={this.state.serviceId} onChange={serviceId => this.setState({ serviceId })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit} disabled={!this.state.serviceId}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
