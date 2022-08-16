import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { ExpandMoreIcon } from '../../layout/icons';
import { CompanyStore } from '../../stores/companyStore';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { PeopleStore } from '../../stores/peopleStore';
import compose from '../../utilities/compose';

interface Props {
  customerTagStore?: CustomerTagStore;
  store?: PeopleStore | CompanyStore;
}

@compose(
  inject('customerTagStore'),
  observer,
)
export default class PersonFilterForm extends React.Component<Props> {
  state = {
    open: false,
    filterTags: [] as number[],
  };

  componentDidMount() {
    this.props.customerTagStore!.fetchAll();
    this.setState({filterTags: this.props.store!.customerFilter.tags});
  }

  updateFilter = (v: number[]) => {
    this.setState({filterTags: v});
    this.props.store!.customerFilter.tags = v;
    this.props.store!.fetchAllPaginated();
  }

  render() {
    return (
      <Grid item xs={12} sm={12} md={8} lg={6}>
        <Accordion expanded={this.state.open} onChange={() => this.setState({ open: !this.state.open })}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            disableRipple={true}
          >
            <Typography variant={'h5'} color="inherit">
              Filter
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ overflowX: 'auto', overflowY: 'hidden', flexWrap: 'wrap' }}>
            <CustomerTagSelect value={this.state.filterTags}  label={'Tags'} onChange={this.updateFilter} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  }
}
