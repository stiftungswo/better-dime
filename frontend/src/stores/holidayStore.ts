import { action, computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface Holiday {
  id: number;
  duration: number;
  date: any; // TODO
  name: string;
}

export class HolidayStore extends AbstractStore<Holiday> {
  protected get entityName() {
    return {
      singular: 'Der Feiertag',
      plural: 'Die Feiertage',
    };
  }

  @computed
  get entities(): Array<Holiday> {
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
  public holidays: Holiday[] = [];

  @observable
  public holiday?: Holiday;

  constructor(mainStore: MainStore) {
    super(mainStore);
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
