import React from 'react';
import moment from 'moment';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import Grid from '@material-ui/core/Grid';
import { DatePicker } from '../../form/fields/DatePicker';
import Button from '@material-ui/core/Button';
import { MainStore } from '../../stores/mainStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { apiDateFormat } from '../../stores/apiStore';

interface Props {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export class RevenueReport extends React.Component<Props> {
  public state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
  };

  public render() {
    return (
      <>
        <DimeAppBar title={'Umsatzrapport'} />

        <DimeContent loading={false}>
          <Grid container alignItems={'center'} spacing={24}>
            <Grid item xs={12} md={3}>
              <DatePicker label={'Von'} value={this.state.start} onChange={d => this.setState({ start: d })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker label={'Bis'} value={this.state.end} onChange={d => this.setState({ end: d })} />
            </Grid>
            <Grid item xs={12}>
              <a href={this.getHref()} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                <Button color={'primary'} variant="contained">
                  Herunterladen
                </Button>
              </a>
            </Grid>
          </Grid>
        </DimeContent>
      </>
    );
  }

  private getHref() {
    return this.props.mainStore!.apiURL('reports/revenue', {
      from: this.state.start.format(apiDateFormat),
      to: this.state.end.format(apiDateFormat),
    });
  }
}
