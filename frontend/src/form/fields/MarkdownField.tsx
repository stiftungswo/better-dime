import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { DelayedInput, InputFieldProps, ValidatedFormGroupWithLabel } from './common';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { VisibilityIcon, VisibilityOffIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';

export class MarkdownField extends React.Component<InputFieldProps> {
  state = {
    preview: true,
  };

  togglePreview = () => this.setState({ preview: !this.state.preview });

  render = () => {
    const { label, field, form, required, disabled } = this.props;
    const previewToggle = (
      <Tooltip title={'Vorschau'}>
        <IconButton onClick={this.togglePreview}>{this.state.preview ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>
      </Tooltip>
    );
    return (
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={12} lg={this.state.preview ? 6 : 12}>
          <ValidatedFormGroupWithLabel label={label} fullWidth field={field} form={form} required={required}>
            <DelayedInput
              {...field}
              fullWidth
              multiline
              rowsMax={14}
              disabled={disabled}
              endAdornment={<InputAdornment position={'end'}>{previewToggle}</InputAdornment>}
            />
          </ValidatedFormGroupWithLabel>
        </Grid>
        <Grid item={true} xs={12} lg={6}>
          {this.state.preview && <MarkdownRender>{this.props.field.value}</MarkdownRender>}
        </Grid>
      </Grid>
    );
  };
}
