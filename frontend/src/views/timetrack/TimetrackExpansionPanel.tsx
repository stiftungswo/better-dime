import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails';
import { ExpandMoreIcon } from '../../layout/icons';

interface Props {
  actions?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}

export class TimetrackExpansionPanel extends React.Component<Props> {
  public state = {
    open: true,
  };

  public changeExpansion = () => {
    this.setState({ open: !this.state.open });
  };

  public render() {
    return (
      <Grid item xs={12}>
        <ExpansionPanel expanded={this.state.open}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon onClick={this.changeExpansion} />}>
            <Grid justify="space-between" container spacing={24}>
              <Grid item>
                <Typography variant={'h5'} color="inherit">
                  {this.props.title}
                </Typography>
              </Grid>
              {this.props.actions}
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ overflowX: 'auto', overflowY: 'hidden' }}>{this.props.children}</ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}
