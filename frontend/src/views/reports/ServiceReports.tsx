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
import { ExportGroupingSelector } from '../../form/entitySelector/ExportGroupingSelector';
import { Typography } from '@material-ui/core';
import { apiDateFormat } from '../../stores/apiStore';

interface Props {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export class ServiceReports extends React.Component<Props> {
  public state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
  };

  public render() {
    return (
      <>
        <DimeAppBar title={'Service-Rapporte'} />

        <DimeContent loading={false}>
          <Typography variant={'h5'}>Stunden pro Service</Typography>

          <Grid container alignItems={'center'} spacing={24}>
            <Grid item xs={12} md={4}>
              <DatePicker label={'Von'} value={this.state.start} onChange={d => this.setState({ start: d })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker label={'Bis'} value={this.state.end} onChange={d => this.setState({ end: d })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ExportGroupingSelector
                fullWidth
                label={'Gruppierung'}
                value={this.state.grouping as 'project' | 'category'}
                onChange={d => this.setState({ grouping: d })}
              />
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
    return this.props.mainStore!.apiURL('reports/service_hours', {
      start: this.state.start.format(apiDateFormat),
      end: this.state.end.format(apiDateFormat),
      group_by: this.state.grouping,
    });
  }
}
