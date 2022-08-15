import { Theme } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import { createStyles, withStyles, WithStyles} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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

class TimetrackAccordionInner extends React.Component<Props> {
  state = {
    open: true,
  };

  changeExpansion = (event: React.ChangeEvent<HTMLElement>, expanded: boolean) => {
    let currentNode = event.target as HTMLElement | null;
    let blockCollapse = false;
    while (currentNode != null) {
      if (currentNode.getAttribute('data-expansion-block') === 'true') {
        blockCollapse = true;
      }
      currentNode = currentNode.parentElement;
    }

    if (!blockCollapse) {
      this.setState({ open: !this.state.open });
    }
  }

  render() {
    const selected = Boolean(this.props.selectedCount);
    return (
      <Grid item xs={12}>
        <Accordion expanded={this.state.open} onChange={this.changeExpansion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classNames({ [this.props.classes.selected]: selected })}
            disableRipple={true}
          >
            <Grid justifyContent="space-between" container spacing={3} alignItems={'center'}>
              <Grid item>
                <Typography variant={'h5'} color="inherit">
                  {this.props.title}
                  {selected && ` - ${this.props.selectedCount} ausgewählt`}
                </Typography>
              </Grid>
              <Grid item data-expansion-block={true}>
                <Grid container alignItems={'center'} spacing={1}>
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
          </AccordionSummary>
          <AccordionDetails style={{ overflowX: 'auto', overflowY: 'hidden', flexWrap: 'wrap' }}>{this.props.children}</AccordionDetails>
        </Accordion>
      </Grid>
    );
  }
}

export const TimetrackAccordion = withStyles(styles)(TimetrackAccordionInner);
