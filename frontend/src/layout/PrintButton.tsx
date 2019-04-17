import { PropTypes } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
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
export default class PrintButton extends React.Component<Props> {
  render = () => {
    const BadgeIcon = this.props.icon;
    if (this.props.disabled) {
      return (
        <ActionButton disabled icon={PrintIcon} secondaryIcon={BadgeIcon} title={this.props.title || 'Drucken'} color={this.props.color} />
      );
    } else {
      return (
        <a href={this.props.mainStore!.apiURL(this.props.path, this.props.urlParams)} target={'_blank'} style={{ color: 'white' }}>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || 'Drucken'}
            color={this.props.color}
            disabled={false}
          />
        </a>
      );
    }
  }
}
