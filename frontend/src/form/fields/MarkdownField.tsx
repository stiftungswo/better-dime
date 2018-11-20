import * as React from 'react';
import { Converter } from 'showdown';
import Grid from '@material-ui/core/Grid/Grid';
import Switch from '@material-ui/core/Switch/Switch';
import Input from '@material-ui/core/Input/Input';
import { InputFieldProps, ValidatedFormGroupWithLabel } from './common';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import compose from '../../utilities/compose';

//these styles try to mirror how the rendered markdown in the printed PDF looks. See base.twig in the backend code.
const styles = (theme: Theme) => {
  const fontSize = theme.typography.body1.fontSize;
  return createStyles({
    container: {
      '& *': {
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        fontSize,
      },
      '& p': {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        fontSize,
        width: '100%',
      },
      '& h1, & h2, & h3': {
        paddingTop: '8px',
        paddingBottom: 0,
        fontSize,
        fontWeight: 'bold',
      },
      '& h1': {
        textDecoration: 'underline',
      },
      '& ul': {
        listStyleType: 'initial',
      },
      '& li': {
        fontSize,
      },
    },
  });
};

interface Props extends InputFieldProps {
  classes?: any;
}

@compose(withStyles(styles))
export class MarkdownField extends React.Component<Props> {
  state = {
    preview: true,
  };

  converter = new Converter();

  togglePreview = () => this.setState({ preview: !this.state.preview });

  get markup() {
    return { __html: this.converter.makeHtml(this.props.field.value) };
  }

  render = () => {
    const { label, field, form, required, disabled, classes } = this.props;
    return (
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={12} lg={6}>
          <ValidatedFormGroupWithLabel label={label} fullWidth field={field} form={form} required={required}>
            <Input {...field} fullWidth multiline rowsMax={14} disabled={disabled} />
          </ValidatedFormGroupWithLabel>
        </Grid>
        <Grid item={true} xs={12} lg={6}>
          Vorschau <Switch checked={this.state.preview} onChange={this.togglePreview} />
          {this.state.preview && <div className={classes.container} dangerouslySetInnerHTML={this.markup} />}
        </Grid>
      </Grid>
    );
  };
}
