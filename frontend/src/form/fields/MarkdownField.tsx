import * as React from 'react';
import { Converter } from 'showdown';
import Grid from '@material-ui/core/Grid/Grid';
import Switch from '@material-ui/core/Switch/Switch';
import Input from '@material-ui/core/Input/Input';
import { ValidatedFormGroupWithLabel } from './common';

export class MarkdownField extends React.Component<any> {
  state = {
    preview: true,
  };

  converter = new Converter();

  togglePreview = () => this.setState({ preview: !this.state.preview });

  get markup() {
    return { __html: this.converter.makeHtml(this.props.field.value) };
  }

  render = () => {
    const { label, field, form, required, disabled } = this.props;
    return (
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={12} lg={6}>
          <ValidatedFormGroupWithLabel label={label} fullWidth field={field} form={form} required={required}>
            <Input {...field} fullWidth multiline rowsMax={14} disabled={disabled} />
          </ValidatedFormGroupWithLabel>
        </Grid>
        <Grid item={true} xs={12} lg={6}>
          Vorschau <Switch checked={this.state.preview} onChange={this.togglePreview} />
          {this.state.preview && <div dangerouslySetInnerHTML={this.markup} />}
        </Grid>
      </Grid>
    );
  };
}
