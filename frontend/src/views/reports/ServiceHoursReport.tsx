import React, { Component } from 'react';
import moment from 'moment';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import Grid from '@material-ui/core/Grid';
import { DatePicker } from '../../form/fields/DatePicker';
import { formikFieldCompatible } from '../../form/fields/Select';
import Button from '@material-ui/core/Button';
import { MainStore } from '../../stores/mainStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';

interface Props {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export class ServiceHoursReport extends React.Component<Props> {
  public state = {
    start: moment()
      .startOf('year')
      .format('YYYY-MM-DD'),
    end: moment()
      .endOf('year')
      .format('YYYY-MM-DD'),
  };

  public render() {
    return (
      <>
        <DimeAppBar title={'Service-Stunden-Rapport'} />

        <DimeContent loading={false}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={3}>
              <DatePicker
                fullWidth
                {...formikFieldCompatible({
                  label: 'Von',
                  value: this.state.start,
                  onChange: d => this.setState({ start: d }),
                })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                fullWidth
                {...formikFieldCompatible({
                  label: 'Bis',
                  value: this.state.end,
                  onChange: d => this.setState({ end: d }),
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <a
                href={this.props.mainStore!.getPrintUrl('reports/service_hours') + '&start=' + this.state.start + '&end=' + this.state.end}
                target={'_blank'}
                style={{ textDecoration: 'none', color: 'white' }}
              >
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
}
