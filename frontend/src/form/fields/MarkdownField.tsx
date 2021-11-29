import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import * as React from 'react';
import { VisibilityIcon, VisibilityOffIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';
import { DimeFormControl, DimeInputFieldProps } from './common';
import {DelayedInput, DimeField} from './formik';

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
      <Grid container spacing={3}>
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
        <Grid item xs={12} lg={6}>
          <div style={{fontSize: '13px', lineHeight: '15px'}}>
            <p style={{fontSize: '14px', marginBottom: '5px', marginTop: '0px'}}><b>Markdown Cheatsheet</b></p>
            <b>Titel: </b> #Titel Beschreibung<br/>
            <b>Untertitel: </b> ##Untertitel Beschreibung<br/>
            <b>Fettgedruckter Text: </b> **Text**<br/>
            <b>Kursiver Text: </b> *Text*<br/>
            <b>Liste: </b><br/>
            - Listenelement 1<br/>
            - Listenelement 2 (keine doppelten Zeilenumbrüche zwischen den Listenelementen!)<br/>
            <b>Nummerierte Liste: </b><br/>
            1. Listenelement 1<br/>
            2. Listenelement 2 (keine doppelten Zeilenumbrüche zwischen den Listenelementen!)<br/>
            <b>Neuer Zeilenumbruch: </b> {'<br>'}
          </div>
        </Grid>
      </Grid>
    );
  }
}
