import { PropTypes } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import CitySelectDialog from '../form/CitySelectDialog';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ActionButton } from './ActionButton';
import { PrintIcon } from './icons';

interface Props {
  icon?: React.ReactType<SvgIconProps>;
  path: string;
  disabled?: boolean;
  color?: PropTypes.Color;
  mainStore?: MainStore;
  title?: string;
  urlParams?: object;
}

@compose(
  inject('mainStore'),
  observer,
)
export default class PrintWithCityButton extends React.Component<Props> {
  state = {
    cityDialogOpen: false,
  };

  render = () => {
    const BadgeIcon = this.props.icon;
    if (this.props.disabled) {
      return (
        <ActionButton disabled icon={PrintIcon} secondaryIcon={BadgeIcon} title={this.props.title || 'Drucken'} color={this.props.color} />
      );
    } else {
      return (
       <>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || 'Drucken'}
            color={this.props.color}
            action={() => this.setState({ cityDialogOpen: true })}
            disabled={false}
            style={{ color: 'white' }}
          />
          {this.state.cityDialogOpen && (
            <CitySelectDialog open path={this.props.path} onClose={() => this.setState({ cityDialogOpen: false })}/>
          )}
       </>
      );
    }
  }
}
