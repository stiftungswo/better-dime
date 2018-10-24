import { action, observable } from 'mobx';
import { MainStore } from './mainStore';

export interface Holiday {
  id: number;
  duration: number;
  date: any; // TODO
  name: string;
}

export class HolidayStore {
  @observable public holidays: Holiday[] = [];

  constructor(private mainStore: MainStore) {}

  @action
  public async fetchHolidays() {
    const res = await this.mainStore.api.get<Holiday[]>('/holidays');
    this.holidays = res.data;
  }

  @action
  public async postHoliday(holiday: Holiday) {
    await this.mainStore.api.post('/holidays', holiday);
    this.mainStore.displaySuccess('Der Feiertag wurde hinzugefügt.');
    await this.fetchHolidays();
  }

  @action
  public async putHoliday(holiday: Holiday) {
    await this.mainStore.api.put('/holidays/' + holiday.id, holiday);
    this.mainStore.displaySuccess('Der Feiertag wurde angepasst.');
    await this.fetchHolidays();
  }

  @action
  public async deleteHoliday(id: number) {
    await this.mainStore.api.delete('/holidays/' + id);
    await this.fetchHolidays();
    this.mainStore.displaySuccess('Der Feiertag wurde entfernt.');
  }
}
