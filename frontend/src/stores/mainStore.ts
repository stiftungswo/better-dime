import { action, computed, observable } from 'mobx';
import { History } from 'history';
import { ApiStore, baseUrl } from './apiStore';
import { Formatter } from '../utilities/formatter';
import { Notifier } from '../utilities/notifier';
import { buildURL } from '../utilities/helpers';

/*
This class manages global UI state and provides some facades for often used functionality
 */
export class MainStore {
  @observable
  drawerOpen = false;

  @observable
  userMenuOpen = false;

  @observable
  userMenuAnchorEl: null | HTMLElement;

  @observable
  showArchived = false;

  public get api() {
    return this.apiStore.api;
  }

  @computed
  public get isAdmin(): boolean {
    return this.apiStore.isAdmin;
  }

  @computed
  public get userId(): number | undefined {
    return this.apiStore.userId;
  }

  constructor(
    private apiStore: ApiStore,
    public readonly formatter: Formatter,
    public readonly notifier: Notifier,
    private history: History
  ) {}

  // --- formatting
  public formatDate = this.formatter.formatDate;
  public formatDuration = this.formatter.formatDuration;
  public formatCurrency = this.formatter.formatCurrency;
  public trimString = this.formatter.trimString;

  // --- snackbar
  public displayInfo = this.notifier.info;
  public displaySuccess = this.notifier.success;
  public displayError = this.notifier.error;

  // --- routing / navigation
  @action
  public navigateTo(path: string): void {
    this.history.push(path);
  }

  public apiURL(path: string, params: object = {}, includeAuth: boolean = true): string {
    return buildURL(baseUrl + '/' + path, {
      ...params,
      auth: includeAuth ? this.apiStore.token : undefined,
    });
  }
}
