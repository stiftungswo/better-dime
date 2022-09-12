import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
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
