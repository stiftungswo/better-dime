import * as React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { PropTypes } from '@material-ui/core';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { PrintIcon } from './icons';

interface Props {
  path: string;
  disabled?: boolean;
  color?: PropTypes.Color;
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export default class PrintButton extends React.Component<Props> {
  public render = () => {
    return (
      <a href={this.props.mainStore!.getPrintUrl(this.props.path)} target={'_blank'} style={{ color: 'white' }}>
        <IconButton disabled={this.props.disabled} color={this.props.color}>
          <PrintIcon />
        </IconButton>
      </a>
    );
  };
}
