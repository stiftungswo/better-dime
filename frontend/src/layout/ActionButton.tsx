import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';

import { PropTypes } from '@mui/material';
import Badge from '@mui/material/Badge';
import { SvgIconProps } from '@mui/material/SvgIcon';
import compose from '../utilities/compose';
import UnstyledLink from './UnstyledLink';

export type ActionButtonAction = (() => void) | string;

type IconType = React.ReactType<SvgIconProps>;

export interface ButtonProps {
  icon: IconType;
  secondaryIcon?: IconType;
  title?: string;
  action?: ActionButtonAction;
  disabled?: boolean;
  color?: PropTypes.Color;
  style?: React.CSSProperties;
}

const withSecondaryIcon = (Icon?: IconType) => (component: React.ReactNode) =>
  Icon ? <Badge badgeContent={<Icon fontSize={'small'} />}>{component}</Badge> : component;
const withLink = (link?: string) => (component: React.ReactNode) => (link ? <UnstyledLink to={link}>{component}</UnstyledLink> : component);
const withTooltip = (text?: string) => (component: React.ReactNode) =>
  text ? (
    <Tooltip title={text} style={{ display: 'inline-block' }}>
      <div>{component}</div>
    </Tooltip>
  ) : (
    component
  );

export class ActionButton extends React.Component<ButtonProps> {
  get route(): string | undefined {
    if (typeof this.props.action === 'string') {
      return this.props.action;
    }
    return undefined;
  }

  get onClick(): (() => void) | undefined {
    if (typeof this.props.action === 'function') {
      return this.props.action;
    }
    return undefined;
  }

  render = () => {
    const Icon = this.props.icon;

    return compose(
      withLink(this.route),
      withTooltip(this.props.title),
    )(
      <IconButton onClick={this.onClick} disabled={this.props.disabled} color={this.props.color} style={this.props.style}>
        {withSecondaryIcon(this.props.secondaryIcon)(<Icon />)}
      </IconButton>,
    );
  }
}
