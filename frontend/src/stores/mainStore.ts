import { History } from 'history';
import { action, computed, makeObservable, observable } from 'mobx';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messagesDe from '../locales/messages.de.json';
import messagesFr from '../locales/messages.fr.json';
import { Locale } from '../types';
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

    /*autorun(() => {
      moment.locale(this.currentLocale);
      this.monthNames = moment.months();
      this.apiStore.setLanguageForApi(this.currentLocale);
    });*/
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
}
