import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import InputBase from '@material-ui/core/InputBase/InputBase';
import * as React from 'react';
import { SearchIcon } from './icons';
import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import { fade } from '@material-ui/core/styles/colorManipulator';

export const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex, shape }: Theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: shape.borderRadius,
      backgroundColor: fade(palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [breakpoints.up('sm')]: {
        marginLeft: spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: spacing.unit,
      paddingRight: spacing.unit,
      paddingBottom: spacing.unit,
      paddingLeft: spacing.unit * 10,
      transition: transitions.create('width'),
      width: '100%',
      [breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
  });

interface AppBarSearchProps extends WithStyles<typeof styles> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppBarSearch = withStyles(styles(DimeTheme))(({ classes, onChange }: AppBarSearchProps) => (
  <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      onChange={onChange}
      placeholder="Suche…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
    />
  </div>
));
