import InputBase from '@material-ui/core/InputBase/InputBase';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { CloseIcon, SearchIcon } from './icons';

export const styles = ({ palette, spacing, breakpoints, transitions, shape }: Theme) =>
  createStyles({
    search: {
      'position': 'relative',
      'borderRadius': shape.borderRadius,
      'backgroundColor': fade(palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(palette.common.white, 0.25),
      },
      'marginLeft': 0,
      'width': '100%',
      [breakpoints.up('sm')]: {
        marginLeft: spacing,
        width: 'auto',
      },
    },
    searchIcon: {
      width: spacing(9),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearIcon: {
      pointerEvents: 'auto',
      cursor: 'pointer',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: spacing,
      paddingRight: spacing,
      paddingBottom: spacing,
      paddingLeft: spacing(10),
      transition: transitions.create('width'),
      width: '100%',
      [breakpoints.up('sm')]: {
        'width': 120,
        '&:focus': {
          width: 200,
        },
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  onChange: (value: string) => void;
  defaultValue: string;
  delay?: number;
}

class AppBarSearchInner extends React.Component<Props> {
  state = {
    value: '',
  };

  delayedOnChange = debounce(value => {
    this.props.onChange(value);
  }, this.props.delay || 0);

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  handleChange = (value: string) => {
    this.setState({ value });
    if (value === '') {
      this.props.onChange(value);
    } else {
      this.delayedOnChange(value);
    }
  }

  render() {
    const { classes } = this.props;
    const clearable = Boolean(this.state.value);
    return (
      <div className={classes.search}>
        <div className={classNames(classes.searchIcon, { [classes.clearIcon]: clearable })} onClick={() => this.handleChange('')}>
          {clearable ? <CloseIcon /> : <SearchIcon />}
        </div>
        <InputBase
          value={this.state.value}
          onChange={e => this.handleChange(e.target.value)}
          placeholder="Suche…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
    );
  }
}

export const AppBarSearch = withStyles({...styles})(AppBarSearchInner);
