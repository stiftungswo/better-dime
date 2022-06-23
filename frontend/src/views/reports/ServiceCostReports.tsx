import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ExportGroupingSelect } from '../../form/entitySelect/ExportGroupingSelect';
import { ServiceSelect } from '../../form/entitySelect/ServiceSelect';
import { SwitchField } from '../../form/fields/common';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { apiDateFormat } from '../../stores/apiStore';
import { MainStore } from '../../stores/mainStore';
import {ServiceStore} from '../../stores/serviceStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'serviceStore'),
  observer,
)
export class ServiceCostReports extends React.Component<Props> {
  state = {
    start: moment().startOf('year'),
    end: moment().endOf('year'),
    grouping: 'project',
    selectedServices: [] as number[],
    include_vat: true,
  };
  componentDidMount() {
    this.props.serviceStore!.fetchAll();
  }

  render() {
    console.log(this.state); // tslint:disable-line:no-console
    const idPrefix = 'view.report.service_cost';
    const intl = this.props.intl!;
    const intlText = wrapIntl(intl, idPrefix);
    return (
      <>
        <DimeAppBar title={intlText('layout.navigation.reports.service_cost', true)} />

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
              <SwitchField
                label={intlText('with_vat')}
                value={this.state.include_vat}
                onChange={e => this.setState({include_vat: e.target.checked})}
              />
            </Grid>
            <Grid item xs={12}>
              <ServiceSelect<number[]>
                isMulti
                value={this.state.selectedServices}
                onChange={s => this.setState({ selectedServices : s})}
                label={intl.formatMessage({id: 'general.service.plural'})}
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
    return this.props.mainStore!.apiV2URL('reports/service_costs.xlsx', {
      start: this.state.start.format(apiDateFormat),
      end: this.state.end.format(apiDateFormat),
      group_by: this.state.grouping,
      services: this.state.selectedServices,
      with_vat: this.state.include_vat,
    });
  }
}
