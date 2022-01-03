import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ExpandMoreIcon } from '../../layout/icons';
import { MarkdownRender } from '../../layout/MarkdownRender';
import { GlobalSettingStore } from '../../stores/globalSettingStore';

interface Props {
  globalSettingStore?: GlobalSettingStore;
  title: string;
}

export class MarkdownAccordion extends React.Component<Props> {
  render() {
    return (
      <Accordion>
        <AccordionSummary disableRipple={true} expandIcon={<ExpandMoreIcon />}>
          <Typography variant={'h6'} color="inherit">
            {this.props.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ overflowX: 'auto', overflowY: 'hidden', flexWrap: 'wrap', position: 'relative'}}>
            <MarkdownRender>
              {this.props.globalSettingStore!.settings!.service_order_comment}
            </MarkdownRender>
        </AccordionDetails>
      </Accordion>
    );
  }
}
