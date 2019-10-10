import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import * as React from 'react';
import { VisibilityIcon, VisibilityOffIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';
import { DimeFormControl, DimeInputFieldProps } from './common';
import { DelayedInput } from './formik';

export class MarkdownField extends React.Component<DimeInputFieldProps> {
  state = {
    preview: true,
  };

  togglePreview = () => this.setState({ preview: !this.state.preview });

  render = () => {
    const { label, required, disabled, errorMessage, value, onChange } = this.props;
    const InputComponent = this.props.InputComponent || DelayedInput;
    const previewToggle = (
      <Tooltip title={'Vorschau'}>
        <IconButton onClick={this.togglePreview}>{this.state.preview ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>
      </Tooltip>
    );
    return (
      <Grid container>
        <Grid item xs={12} lg={this.state.preview ? 6 : 12}>
          <DimeFormControl label={label} required={required} errorMessage={errorMessage}>
            <InputComponent
              onChange={onChange}
              value={value}
              multiline
              rowsMax={14}
              disabled={disabled}
              endAdornment={<InputAdornment position={'end'}>{previewToggle}</InputAdornment>}
            />
          </DimeFormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.state.preview && <MarkdownRender>{value}</MarkdownRender>}
        </Grid>
      </Grid>
    );
  }
}
