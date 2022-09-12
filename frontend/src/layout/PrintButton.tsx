import { PropTypes } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import CitySelectDialog from '../form/dialog/CitySelectDialog';
import { MainStore } from '../stores/mainStore';
import { Location } from '../types';
import compose from '../utilities/compose';
import { ActionButton } from './ActionButton';
import { PrintIcon } from './icons';
import UnstyledBackendLink from './UnstyledBackendLink';

interface Props {
  intl?: IntlShape;
  icon?: React.ReactType<SvgIconProps>;
  path: string;
  disabled?: boolean;
  hasCitySelection?: boolean;
  citySelectionSaveCallback?: (city: Location) => void;
  color?: PropTypes.Color;
  mainStore?: MainStore;
  title?: string;
  urlParams?: object;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export default class PrintButton extends React.Component<Props> {
  state = {
    cityDialogOpen: false,
  };

  render() {
    const BadgeIcon = this.props.icon;
    const printLabel = this.props.intl!.formatMessage({id: 'layout.print_button.print'});
    if (this.props.disabled) {
      return (
        <ActionButton disabled icon={PrintIcon} secondaryIcon={BadgeIcon} title={this.props.title || printLabel} color={this.props.color} />
      );
    } else if (this.props.hasCitySelection) {
      return (
       <>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || printLabel}
            color={this.props.color}
            action={() => this.setState({ cityDialogOpen: true })}
            disabled={false}
          />
          {this.state.cityDialogOpen && (
            <CitySelectDialog open path={this.props.path} onClose={() => this.setState({ cityDialogOpen: false })} saveCallback={this.props.citySelectionSaveCallback}/>
          )}
       </>
      );
    } else {
      return (
        <UnstyledBackendLink url={this.props.mainStore!.apiV2URL_localized(this.props.path, this.props.urlParams)}>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || printLabel}
            color={this.props.color}
            disabled={false}
          />
        </UnstyledBackendLink>
      );
    }
  }
}
