import { Theme } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { createStyles, makeStyles, WithStyles } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import * as React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { CloseIcon, SearchIcon } from './icons';

const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex, shape }: Theme) =>
  createStyles({
    search: {
      'position': 'relative',
      'borderRadius': shape.borderRadius,
      'backgroundColor': alpha(palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(palette.common.white, 0.25),
      },
      'marginLeft': 0,
      'width': '100%',
      [breakpoints.up('sm')]: {
        marginLeft: spacing(1),
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
      paddingTop: spacing(1),
      paddingRight: spacing(1),
      paddingBottom: spacing(1),
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
const useStyles = makeStyles(styles);

interface Props extends WithStyles<typeof styles> {
  intl?: IntlShape;
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
    const intl = this.props.intl!;
    const clearable = Boolean(this.state.value);
    return (
      <div className={classes.search}>
        <div className={classNames(classes.searchIcon, { [classes.clearIcon]: clearable })} onClick={() => this.handleChange('')}>
          {clearable ? <CloseIcon /> : <SearchIcon />}
        </div>
        <InputBase
          value={this.state.value}
          onChange={e => this.handleChange(e.target.value)}
          placeholder={intl.formatMessage({id: 'layout.app_bar_search.placeholder'})}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
    );
  }
}
// mixing @injectIntl with withStyles(...) didn't work, so here's a wrapper
// component with hooks.
export const AppBarSearch = (props: any) => {
  const intl = useIntl();
  const classes = useStyles();
  return (
    <AppBarSearchInner intl={intl} classes={classes} {...props} />
  );
};
