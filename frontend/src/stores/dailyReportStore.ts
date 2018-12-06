import { action, observable } from 'mobx';
import { MainStore } from './mainStore';
import moment from 'moment';

export interface DailyReportResponse {
  dates: string[];
  employees: Employee[];
}

export interface Employee {
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
  public result: DailyReportResponse = { dates: [], employees: [] };

  @observable
  public detail?: DailyReportEffort[] = undefined;

  @observable
  //TODO centralize this formating somehow
  public from = moment()
    .subtract(6, 'days')
    .startOf('day')
    .format('YYYY-MM-DD');

  @observable
  public to = moment()
    .endOf('day')
    .format('YYYY-MM-DD');

  constructor(private mainStore: MainStore) {}

  @action.bound
  public async fetch() {
    const res = await this.mainStore.api.get<DailyReportResponse>('/reports/daily', {
      params: {
        from: this.from,
        to: this.to,
      },
    });
    this.result = observable(res.data);
  }
}
