import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Converter } from 'showdown';

// these styles try to mirror how the rendered markdown in the printed PDF looks. See base.twig in the backend code.
const dimeDocumentStyles = (theme: Theme) => {
  const baseFontSize = 15;
  const h1FontSize = baseFontSize + 3;
  return createStyles({
    container: {
      'marginTop': '16px', // this is the 'normal' margin of formControl, but where could this be stored in theme?
      '& *': {
        fontSize: baseFontSize + 'px',
      },
      '& p': {
        fontSize: baseFontSize + 'px',
        width: '100%',
      },
      '& h1, & h2, & h3': {
        paddingTop: '8px',
        fontSize: baseFontSize + 'px',
        fontWeight: 'bold',
      },
      '& h1': {
        fontSize: h1FontSize + 'px',
      },
      '& ul': {
        'listStyleType': 'initial',
        '& li': {
          listStyleType: 'none',
        },
        '& li::before': {
          content: '"-"',
          marginLeft: '-10px',
          position: 'absolute',
        },
      },
      '& li': {
        fontSize: baseFontSize + 'px',
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
    this.converter.setOption('simpleLineBreaks', true);
    return { __html: this.converter.makeHtml(this.props.children) };
  }

  render = () => {
    return <div className={this.props.classes.container} dangerouslySetInnerHTML={this.markup} />;
  }
}
export const MarkdownRender = withStyles(dimeDocumentStyles)(MarkdownRenderInner);
