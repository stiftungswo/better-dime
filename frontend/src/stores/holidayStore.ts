import { action, computed, observable } from 'mobx';
import moment from 'moment';
import { Holiday } from '../types';
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
    await this.mainStore.api.delete('/holidays/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Holiday>('/holidays/' + id + '/duplicate');
  }

  @action
  protected async doFetchAll() {
    const res = await this.mainStore.api.get<Holiday[]>('/holidays', {params: this.getQueryParams()});
    this.holidays = res.data;
  }

  @action
  protected async doPost(holiday: Holiday) {
    await this.mainStore.api.post('/holidays', holiday);
    await this.doFetchAll();
  }

  @action
  protected async doPut(holiday: Holiday) {
    await this.mainStore.api.put('/holidays/' + holiday.id, holiday);
    await this.doFetchAll();
  }
}
