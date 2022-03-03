import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { AbstractStore } from '../../stores/abstractStore';
import { ServiceStore } from '../../stores/serviceStore';
import { PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';
import { ServiceSelect } from '../entitySelect/ServiceSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  serviceStore?: ServiceStore;
  intl?: IntlShape;
  onSubmit: (groupName: string | null) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@compose(
  injectIntl,
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
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.position_group_sort');
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="lg">
        <DialogTitle>
          <FormattedMessage id="form.dialog.position_group_sort.title" />
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {this.props.groupingEntity && (
            <PositionGroupSelect
              creatable={false}
              label={intlText('service_group')}
              groupingEntity={this.props.groupingEntity!}
              placeholder={this.props.placeholder}
              value={this.state.positionGroupName}
              onChange={positionGroupName => this.setState({ positionGroupName })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit}>
            <FormattedMessage id="form.dialog.position_group_sort.confirm" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
