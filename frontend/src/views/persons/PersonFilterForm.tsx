import ExpansionPanel from '@material-ui/core/ExpansionPanel/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { ExpandMoreIcon } from '../../layout/icons';
import { PeopleStore } from '../../stores/peopleStore';
import compose from '../../utilities/compose';

interface Props {
  peopleStore?: PeopleStore;
}

@compose(
  inject('customerTagStore', 'peopleStore', 'mainStore'),
  observer,
)
export default class PersonFilterForm extends React.Component<Props> {
  state = {
    open: true,
    filterTags: [] as number[],
  };

  componentWillMount() {
    this.setState({filterTags: this.props.peopleStore!.customerFilter.tags});
  }

  updateFilter = (v: number[]) => {
    console.log(this.state.filterTags, '->', v); // tslint:disable-line:no-console
    this.setState({filterTags: v});
    this.props.peopleStore!.customerFilter.tags = v;
    this.props.peopleStore!.fetchAllPaginated();
  }

  render() {
    const peopleStore = this.props.peopleStore;

    return (
      <Grid item sm={12} md={8} lg={6}>
        <ExpansionPanel expanded={this.state.open} onChange={() => this.setState({ open: !this.state.open })}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            disableRipple={true}
          >
            <Typography variant={'h5'} color="inherit">
              Filter
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ overflowX: 'auto', overflowY: 'hidden', flexWrap: 'wrap' }}>
            <CustomerTagSelect value={this.state.filterTags}  label={'Tags'} onChange={this.updateFilter} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}
