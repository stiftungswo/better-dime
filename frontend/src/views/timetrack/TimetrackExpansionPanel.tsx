import { Theme } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid/Grid';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import classNames from 'classnames';
import React from 'react';
import { ExpandMoreIcon } from '../../layout/icons';

export const styles = (theme: Theme) =>
  createStyles({
    selected: {
      backgroundColor: theme.palette.secondary.light,
    },
  });

interface Props extends WithStyles<typeof styles> {
  actions?: React.ReactNode;
  selectedActions?: React.ReactNode;
  children: React.ReactNode;
  title: string;
  displayTotal?: string;
  selectedCount?: number;
}

class TimetrackExpansionPanelInner extends React.Component<Props> {
  state = {
    open: true,
  };

  changeExpansion = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const selected = Boolean(this.props.selectedCount);
    return (
      <Grid item xs={12}>
        <ExpansionPanel expanded={this.state.open} onChange={this.changeExpansion}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            className={classNames({ [this.props.classes.selected]: selected })}
            disableRipple={true}
          >
            <Grid justify="space-between" container spacing={6} alignItems={'center'}>
              <Grid item>
                <Typography variant={'h5'} color="inherit">
                  {this.props.title}
                  {selected && ` - ${this.props.selectedCount} ausgewählt`}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container alignItems={'center'} spacing={2}>
                  {this.props.displayTotal && !selected && (
                    <Grid item>
                      <Typography variant={'h6'} color={'textSecondary'}>
                        {this.props.displayTotal}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item>{selected ? this.props.selectedActions : this.props.actions}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ overflowX: 'auto', overflowY: 'hidden' }}>{this.props.children}</ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}

export const TimetrackExpansionPanel = withStyles(styles)(TimetrackExpansionPanelInner);
