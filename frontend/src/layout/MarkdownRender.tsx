import * as React from 'react';
import { Converter } from 'showdown';
import { Theme, WithStyles, withStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';

//these styles try to mirror how the rendered markdown in the printed PDF looks. See base.twig in the backend code.
const dimeDocumentStyles = (theme: Theme) => {
  const fontSize = theme.typography.body1.fontSize;
  return createStyles({
    container: {
      marginTop: '16px', //this is the 'normal' margin of formControl, but where could this be stored in theme?
      '& *': {
        fontSize,
      },
      '& p': {
        fontSize,
        width: '100%',
      },
      '& h1, & h2, & h3': {
        paddingTop: '8px',
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

interface Props extends WithStyles<typeof dimeDocumentStyles> {
  children: string;
}

class MarkdownRenderInner extends React.Component<Props> {
  converter = new Converter();

  get markup() {
    return { __html: this.converter.makeHtml(this.props.children) };
  }

  render = () => {
    return <div className={this.props.classes.container} dangerouslySetInnerHTML={this.markup} />;
  };
}
export const MarkdownRender = withStyles(dimeDocumentStyles)(MarkdownRenderInner);
