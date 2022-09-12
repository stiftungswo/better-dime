import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import BlackButton from '../../layout/BlackButton';
import { ServiceStore } from '../../stores/serviceStore';
import { PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';
import { ServiceCategorySelect } from '../entitySelect/ServiceCategorySelect';
import { ServiceSelect } from '../entitySelect/ServiceSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  serviceStore?: ServiceStore;
  intl?: IntlShape;
  onSubmit: (service: Service, groupName: string | null) => void;
  groupingEntity?: PositionGroupings<any>;
  groupName?: string;
  placeholder?: string;
}

@compose(
  injectIntl,
  inject('serviceStore'),
  observer,
)
export class ServiceSelectDialog extends React.Component<Props> {
  state = {
    serviceId: null,
    serviceCategoryId: null,
    positionGroupName: defaultPositionGroup().name,
  };

  componentDidMount(): void {
    this.setState({positionGroupName: this.props.groupName});
  }

  handleSubmit = () => {
    this.props.serviceStore!.notifyProgress(async () => {
      await this.props.serviceStore!.fetchOne(this.state.serviceId!);
      const service = this.props.serviceStore!.service as Service;
      if (this.state.positionGroupName != null) {
        this.props.onSubmit(service, this.state.positionGroupName);
      } else {
        this.props.onSubmit(service, null);
      }
      this.props.onClose();
    });
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.service_select');
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="lg">
        <DialogTitle>
          <FormattedMessage id="form.dialog.service_select.title" />
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {this.props.groupingEntity && (
            <PositionGroupSelect
              label={intlText('service_group')}
              groupingEntity={this.props.groupingEntity!}
              placeholder={this.props.placeholder}
              value={this.state.positionGroupName}
              onChange={positionGroupName => this.setState({ positionGroupName })}
            />
          )}
          <ServiceCategorySelect<number>
            label={intlText('service_category_optional')}
            isClearable
            mode="all"
            value={this.state.serviceCategoryId}
            onChange={serviceCategoryId => this.setState({ serviceCategoryId })}
          />
          <ServiceSelect<number>
            label={intlText('general.service', true)}
            value={this.state.serviceId}
            onChange={serviceId => this.setState({ serviceId })}
            categoryFilter={this.state.serviceCategoryId}
          />
        </DialogContent>
        <DialogActions>
          <BlackButton onClick={this.handleSubmit} disabled={!this.state.serviceId}>
            <FormattedMessage id="general.action.add" />
          </BlackButton>
        </DialogActions>
      </Dialog>
    );
  }
}
