import { action, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { apiDateFormat } from './apiStore';
import { MainStore } from './mainStore';

export interface DailyReportResponse {
  dates: string[];
  employees: Employee[];
}

interface Employee {
  employee_id: number;
  name: string;
  efforts: { [key: string]: DailyReportEffort[] };
}

export interface DailyReportEffort {
  date: string;
  value: string;
  service_id: number;
  service_name: string;
}

export class DailyReportStore {
  @observable
  result: DailyReportResponse = { dates: [], employees: [] };

  @observable
  detail?: DailyReportEffort[] = undefined;

  @observable
  from = moment()
    .subtract(6, 'days')
    .startOf('day');

  @observable
  to = moment().endOf('day');

  constructor(private mainStore: MainStore) {
    makeObservable(this);
  }

  @action.bound
  async fetch() {
    const res = await this.mainStore.apiV2.get<DailyReportResponse>('/reports/daily', {
      params: {
        from: this.from.format(apiDateFormat),
        to: this.to.format(apiDateFormat),
      },
    });
    this.result = observable(res.data);
  }
}
