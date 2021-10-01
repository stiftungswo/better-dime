import ExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography/Typography';
import React from 'react';
import { ExpandMoreIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';
import { GlobalSettingStore } from '../../stores/globalSettingStore';

interface Props {
  globalSettingStore?: GlobalSettingStore;
  title: string;
}

export class MarkdownExpansionPanel extends React.Component<Props> {
  render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary disableRipple={true} expandIcon={<ExpandMoreIcon />}>
          <Typography variant={'h6'} color="inherit">
            {this.props.title}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ overflowX: 'auto', overflowY: 'hidden', flexWrap: 'wrap', position: 'relative'}}>
            <MarkdownRender>
              {this.props.globalSettingStore!.settings!.service_order_comment}
            </MarkdownRender>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
