import * as React from 'react';
import { PropTypes } from '@material-ui/core';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { PrintIcon } from './icons';
import { ActionButton } from './ActionButton';

interface Props {
  icon?: React.ReactType;
  path: string;
  disabled?: boolean;
  color?: PropTypes.Color;
  mainStore?: MainStore;
  title?: string;
  urlParams?: object;
}

@compose(
  inject('mainStore'),
  observer
)
export default class PrintButton extends React.Component<Props> {
  public render = () => {
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
  };
}
