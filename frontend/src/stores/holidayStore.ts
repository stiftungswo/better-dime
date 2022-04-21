import { action, computed, makeObservable, observable, override } from 'mobx';
import moment from 'moment';
import { Holiday } from '../types';
import { AbstractSimpleStore } from './abstractSimpleStore';
import { MainStore } from './mainStore';

export class HolidayStore extends AbstractSimpleStore<Holiday> {
  protected get entityName() {
    return {
      singular: 'Der Feiertag',
      plural: 'Die Feiertage',
    };
  }
  protected get entityUrlName(): string {
    return 'holidays';
  }

  constructor(mainStore: MainStore) {
    super(mainStore, {
      canArchive: false,
      canDelete: true,
      canDuplicate: true,
      canFetchOne: false,
      canPostPut: true,
    });
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
}
