import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { DatePicker } from '../../form/fields/DatePicker';
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
export class PercentageReport extends React.Component<Props> {
  state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
  };

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.report.costgroup');
    return (
      <>
        <DimeAppBar title={intlText('layout.navigation.reports.costgroup', true)} />

        <DimeContent loading={false}>
          <Grid container alignItems={'center'} spacing={3}>
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
    return this.props.mainStore!.apiV2URL('reports/costgroup.xlsx', {
      from: this.state.start.format(apiDateFormat),
      to: this.state.end.format(apiDateFormat),
    });
  }
}
