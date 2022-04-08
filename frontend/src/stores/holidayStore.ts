import { action, computed, makeObservable, observable, override } from 'mobx';
import moment from 'moment';
import {Holiday, PaginatedData} from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class HolidayStore extends AbstractStore<Holiday> {
  protected get entityName() {
    return {
      singular: 'Der Feiertag',
      plural: 'Die Feiertage',
    };
  }

  @computed
  get entities(): Holiday[] {
    return this.holidays;
  }

  @computed
  get entity(): Holiday | undefined {
    return this.holiday;
  }

  set entity(holiday: Holiday | undefined) {
    this.holiday = holiday;
  }

  @observable
  holidays: Holiday[] = [];

  @observable
  holiday?: Holiday;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  protected processSearchQuery(query: string) {
    const dateA = moment(query, 'DD.MM.YYYY', true);
    const dateB = moment(query, 'DD.MM', true);
    const dateC = moment(query, 'MM.YYYY', true);

    if (dateA.isValid()) {
      return dateA.format('YYYY-MM-DD');
    } else if (dateB.isValid()) {
      return dateB.format('MM-DD');
    } else if (dateC.isValid()) {
      return dateC.format('YYYY-MM');
    } else {
      return query.toLocaleLowerCase();
    }
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/holidays/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Holiday>('/holidays/' + id + '/duplicate');
  }

  @action
  protected async doFetchAll() {
    const res = await this.mainStore.apiV2.get<Holiday[]>('/holidays');
    console.log(res); // tslint:disable-line:no-console
    this.holidays = res.data;
  }

  @action
  protected async doFetchFiltered() {
    const res = await this.mainStore.apiV2.get<Holiday[]>('/holidays', {params: this.getQueryParams()});
    console.log(res); // tslint:disable-line:no-console
    this.holidays = res.data;
  }

  @action
  protected async doPost(holiday: Holiday) {
    await this.mainStore.apiV2.post('/holidays', holiday);
    await this.doFetchAll();
  }

  @override
  protected async doPut(holiday: Holiday) {
    await this.mainStore.apiV2.put('/holidays/' + holiday.id, holiday);
    await this.doFetchAll();
  }
}
