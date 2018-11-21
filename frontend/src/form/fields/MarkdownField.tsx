import * as React from 'react';
import { Converter } from 'showdown';
import Grid from '@material-ui/core/Grid/Grid';
import { DelayedInput, InputFieldProps, ValidatedFormGroupWithLabel } from './common';
import { createStyles, IconButton, InputAdornment, Theme, Tooltip, withStyles } from '@material-ui/core';
import compose from '../../utilities/compose';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

//these styles try to mirror how the rendered markdown in the printed PDF looks. See base.twig in the backend code.
const styles = (theme: Theme) => {
  const fontSize = theme.typography.body1.fontSize;
  return createStyles({
    container: {
      marginTop: '16px', //this is the 'normal' margin of formControl, but where could this be stored in theme?
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
          {this.state.preview && <div className={classes.container} dangerouslySetInnerHTML={this.markup} />}
        </Grid>
      </Grid>
    );
  };
}
