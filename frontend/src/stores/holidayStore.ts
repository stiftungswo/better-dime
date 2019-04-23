import { action, computed, observable } from 'mobx';
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

  filter = (h: Holiday) => {
    return [h.name, this.mainStore!.formatDate(h.date)].some(s => s.toLowerCase().includes(this.searchQuery));
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
    const res = await this.mainStore.api.get<Holiday[]>('/holidays');
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
