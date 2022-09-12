import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ExportGroupingSelect } from '../../form/entitySelect/ExportGroupingSelect';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { apiDateFormat } from '../../stores/apiStore';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export class ServiceHourReports extends React.Component<Props> {
  state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
  };

  render() {
    const idPrefix = 'view.report.service_hour';
    const intlText = wrapIntl(this.props.intl!, idPrefix);
    return (
      <>
        <DimeAppBar title={intlText('layout.navigation.reports.service_hour', true)} />

        <DimeContent loading={false}>
          <Typography variant={'h5'}> <FormattedMessage id={idPrefix + '.title'} /> </Typography>

          <Grid container alignItems={'center'} spacing={3}>
            <Grid item xs={12} md={8}>
              <DateSpanPicker
                fromValue={this.state.start}
                onChangeFrom={d => this.setState({ start: d })}
                toValue={this.state.end}
                onChangeTo={d => this.setState({ end: d })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ExportGroupingSelect
                label={intlText('grouping')}
                value={this.state.grouping as 'project' | 'category'}
                onChange={d => this.setState({ grouping: d })}
              />
            </Grid>
            <Grid item xs={12}>
              <a href={this.getHref()} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
                <Button color={'primary'} variant="contained">
                  <FormattedMessage id="general.action.download" />
                </Button>
              </a>
            </Grid>
          </Grid>
        </DimeContent>
      </>
    );
  }

  private getHref() {
    return this.props.mainStore!.apiV2URL('reports/service_hours.xlsx', {
      start: this.state.start.format(apiDateFormat),
      end: this.state.end.format(apiDateFormat),
      group_by: this.state.grouping,
    });
  }
}
