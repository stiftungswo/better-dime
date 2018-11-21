import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import InputBase from '@material-ui/core/InputBase/InputBase';
import * as React from 'react';
import { styles } from './DimeLayout';
import { SearchIcon } from './icons';

interface AppBarSearchProps extends WithStyles<typeof styles> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AppBarSearch = withStyles(styles(DimeTheme))(({ classes, value, onChange }: AppBarSearchProps) => (
  <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      value={value}
      onChange={onChange}
      placeholder="Suche…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
    />
  </div>
));
