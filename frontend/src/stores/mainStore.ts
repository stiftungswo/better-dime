import { History } from 'history';
import { action, autorun, computed, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messagesDe from '../locales/messages.de.json';
import messagesFr from '../locales/messages.fr.json';
import { Employee, Locale } from '../types';
import { Formatter } from '../utilities/formatter';
import { buildURL } from '../utilities/helpers';
import { Notifier } from '../utilities/notifier';
import { ApiStore, baseUrlV2 } from './apiStore';

const cache = createIntlCache();

export const germanLocale = 'de';
export const frenchLocale = 'fr';
export const defaultLocale = germanLocale;

export const messages: { [locale in Locale]: any } = {
  [germanLocale]: messagesDe,
  [frenchLocale]: messagesFr,
};

function isValidLocale(name: string): boolean {
    return name === germanLocale || name === frenchLocale;
}

const momentLocale: { [locale in Locale]: any } = {
  [germanLocale]: 'de-ch',
  [frenchLocale]: 'fr',
};

/*
This class manages global UI state and provides some facades for often used functionality
 */
export class MainStore {

  get apiV2() {
    return this.apiStore.apiV2;
  }

  @computed
  get intl() {
    return createIntl(
      {
        locale: this.currentLocale,
        messages: messages[this.currentLocale],
      },
      cache,
    );
  }

  @computed
  get isAdmin(): boolean {
    return this.apiStore.isAdmin;
  }

  @computed
  get userId(): number | undefined {
    return this.apiStore.userId;
  }
  @observable
  drawerOpen = false;

  @observable
  userMenuOpen = false;

  @observable
  userMenuAnchorEl: null | HTMLElement;

  @observable
  showArchived = false;

  // TODO: write get / set with localStorage?
  @observable
  currentLocale: Locale = defaultLocale;

  // --- formatting
  formatDate = this.formatter.formatDate;
  formatDuration = this.formatter.formatDuration;
  formatCurrency = this.formatter.formatCurrency;
  trimString = this.formatter.trimString;

  // --- snackbar
  displayInfo = this.notifier.info;
  displaySuccess = this.notifier.success;
  displayError = this.notifier.error;

  constructor(
    private apiStore: ApiStore,
    readonly formatter: Formatter,
    readonly notifier: Notifier,
    private history: History,
  ) {
    makeObservable(this);
    this.handle_user_based_locale();

    autorun(() => {
      moment.locale(momentLocale[this.currentLocale]);
    });
  }

  // --- routing / navigation
  @action
  navigateTo(path: string): void {
    this.history.push(path);
  }

  apiV2URL(path: string, params: object = {}, includeAuth: boolean = true): string {
    return buildURL(baseUrlV2 + '/' + path, {
      ...params,
      token: includeAuth ? this.apiStore.tokenV2.toString().replace('Bearer ', '') : undefined,
    });
  }
  apiV2URL_localized(path: string, params: object = {}): string {
    return this.apiV2URL(path, {
      ...params,
      locale: this.currentLocale,
    });
  }

  async handle_user_based_locale(): Promise<void> {
      // fetches user language from backend and init locale based on that.
      const myId = this.userId;
      if (myId === undefined) { return; }
      const result = await this.apiV2.get<Employee>('/employees/' + myId!);
      const myLocale = result.data.locale;
      if (isValidLocale(myLocale)) {
          this.currentLocale = myLocale as Locale;
      }
      console.log(myLocale); // tslint:disable-line:no-console
  }
}
