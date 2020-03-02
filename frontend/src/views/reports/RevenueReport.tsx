import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { apiDateFormat } from '../../stores/apiStore';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer,
)
export class RevenueReport extends React.Component<Props> {
  state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
  };

  render() {
    return (
      <>
        <DimeAppBar title={'Umsatzrapport'} />

        <DimeContent loading={false}>
          <Grid container alignItems={'center'} spacing={24}>
            <Grid item xs={12} md={6}>
              <DateSpanPicker
                fromValue={this.state.start}
                onChangeFrom={d => this.setState({ start: d })}
                toValue={this.state.end}
                onChangeTo={d => this.setState({ end: d })}
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
    return this.props.mainStore!.apiV2URL('reports/revenue.xlsx', {
      from: this.state.start.format(apiDateFormat),
      to: this.state.end.format(apiDateFormat),
    });
  }
}
