import { History } from 'history';
import { action, computed, observable } from 'mobx';
import { Formatter } from '../utilities/formatter';
import { buildURL } from '../utilities/helpers';
import { Notifier } from '../utilities/notifier';
import { ApiStore, baseUrl } from './apiStore';

/*
This class manages global UI state and provides some facades for often used functionality
 */
export class MainStore {

  get api() {
    return this.apiStore.api;
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
  ) {}

  // --- routing / navigation
  @action
  navigateTo(path: string): void {
    this.history.push(path);
  }

  apiURL(path: string, params: object = {}, includeAuth: boolean = true): string {
    return buildURL(baseUrl + '/' + path, {
      ...params,
      auth: includeAuth ? this.apiStore.token : undefined,
    });
  }
}
