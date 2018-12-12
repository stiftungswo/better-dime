import * as React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

import UnstyledLink from './UnstyledLink';
import { PropTypes } from '@material-ui/core';
import compose from '../utilities/compose';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Badge from '@material-ui/core/Badge';

export type ActionButtonAction = (() => void) | string;

type IconType = React.ReactType<SvgIconProps>;

export interface ButtonProps {
  icon: IconType;
  secondaryIcon?: IconType;
  title?: string;
  action?: ActionButtonAction;
  disabled?: boolean;
  color?: PropTypes.Color;
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
  public get route(): string | undefined {
    if (typeof this.props.action === 'string') {
      return this.props.action;
    }
    return undefined;
  }

  public get onClick(): (() => void) | undefined {
    if (typeof this.props.action === 'function') {
      return this.props.action;
    }
    return undefined;
  }

  public render = () => {
    const Icon = this.props.icon;

    return compose(
      withLink(this.route),
      withTooltip(this.props.title)
    )(
      <IconButton onClick={this.onClick} disabled={this.props.disabled} color={this.props.color}>
        {withSecondaryIcon(this.props.secondaryIcon)(<Icon />)}
      </IconButton>
    );
  };
}
