import * as React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { PropTypes, Tooltip } from '@material-ui/core';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { PrintIcon } from './icons';
import Badge from '@material-ui/core/Badge/Badge';

interface Props {
  icon?: any;
  path: string;
  disabled?: boolean;
  color?: PropTypes.Color;
  mainStore?: MainStore;
  title?: string;
}

@compose(
  inject('mainStore'),
  observer
)
export default class PrintButton extends React.Component<Props> {
  public render = () => {
    const BadgeIcon = this.props.icon;
    return (
      <a href={this.props.mainStore!.getPrintUrl(this.props.path)} target={'_blank'} style={{ color: 'white' }}>
        <Tooltip title={this.props.title || 'Drucken'}>
          <IconButton disabled={this.props.disabled} color={this.props.color}>
            {BadgeIcon ? (
              <Badge badgeContent={<BadgeIcon fontSize={'small'} />}>
                <PrintIcon />
              </Badge>
            ) : (
              <PrintIcon />
            )}
          </IconButton>
        </Tooltip>
      </a>
    );
  };
}
