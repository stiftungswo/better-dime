import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { VisibilityIcon, VisibilityOffIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';
import { DimeFormControl, DimeInputFieldProps } from './common';
import { DelayedInput, DimeField } from './formik';
import MarkdownCheatSheet from './MarkdownCheatSheet';

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
        <IconButton onClick={this.togglePreview} size="large">{this.state.preview ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>
      </Tooltip>
    );
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={this.state.preview ? 6 : 12}>
          <DimeFormControl label={label} required={required} errorMessage={errorMessage}>
            <InputComponent
              onChange={onChange}
              value={value}
              multiline
              maxRows={14}
              disabled={disabled}
              endAdornment={<InputAdornment position={'end'}>{previewToggle}</InputAdornment>}
            />
          </DimeFormControl>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.state.preview && <MarkdownRender>{value}</MarkdownRender>}
        </Grid>
        <Grid item xs={12} lg={6}>
          <MarkdownCheatSheet />
        </Grid>
      </Grid>
    );
  }
}
