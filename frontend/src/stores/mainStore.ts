import axios, { AxiosError, AxiosInstance } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { History } from 'history';
import { OptionsObject } from 'notistack';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import { EmployeeStore } from './employeeStore';

// this will be replaced by a build script, if necessary
const baseUrlOverride = 'BASE_URL';
const baseUrl = baseUrlOverride.startsWith('http') ? baseUrlOverride : 'http://localhost:38000/api/v1';

const KEY_TOKEN = 'dime_token';

interface JwtToken {
  token: string;
}

export interface JwtTokenDecoded {
  exp: number;
  iat: number;
  is_admin: boolean;
  iss: string;
  sub: number;
  details: {
    first_name: string;
    last_name: string;
  };
}

function setAuthHeader(client: AxiosInstance, token: string | null) {
  client.defaults.headers['Authorization'] = token ? 'Bearer ' + token : '';
}

export class MainStore {
  private _api: AxiosInstance;
  @observable
  private openRequests = 0;
  @observable
  private _token: string = '';

  @observable
  drawerOpen = false;

  @observable
  userMenuOpen = false;

  @observable
  userMenuAnchorEl: null | HTMLElement;

  @computed
  public get loading() {
    return this.openRequests > 0;
  }

  @computed
  public get token() {
    return this._token;
  }
  public set token(token) {
    this._token = token;
    localStorage.setItem(KEY_TOKEN, token);
    setAuthHeader(this._api, token);
  }

  public logout(): void {
    localStorage.removeItem(KEY_TOKEN);
    this._token = '';
    setAuthHeader(this._api, this._token);
    this.navigateTo('/');
  }

  public get api() {
    return this._api;
  }

  constructor(private history: History, private enqueueSnackbar: (message: string, options?: OptionsObject) => void) {
    const token = localStorage.getItem(KEY_TOKEN);
    if (token) {
      this._token = token;
    }

    this._api = axios.create({
      baseURL: baseUrl,
    });
    setAuthHeader(this._api, token);

    this._api.interceptors.request.use(
      config => {
        this.openRequests += 1;
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this._api.interceptors.response.use(
      response => {
        this.openRequests -= 1;
        return response;
      },
      (error: AxiosError) => {
        this.openRequests -= 1;
        if (error.response && error.response.status === 401) {
          console.log('Unathorized API access, redirect to login');
          this.history.push('/login');
        }
        return Promise.reject(error);
      }
    );
  }

  @action
  public async postLogin(values: { email: string; password: string }) {
    const { email, password } = values;
    const res = await this._api.post<JwtToken>('employees/login', {
      email,
      password,
    });
    runInAction(() => {
      this.token = res.data.token;
    });
  }

  @action
  public navigateTo(path: string): void {
    this.history.push(path);
  }

  public getPrintUrl(path: string): string {
    return `${baseUrl}/${path}?auth=${this.token}`;
  }

  @computed
  public get isLoggedIn() {
    return !!this._token;
  }

  @computed
  public get isAdmin(): boolean {
    return this.decodeJWT().is_admin;
  }

  @computed
  public get meDetail(): JwtTokenDecoded['details'] {
    return this.decodeJWT().details;
  }

  @computed
  public get meSub(): number | undefined {
    if (this._token) {
      return this.decodeJWT().sub;
    } else {
      return undefined;
    }
  }

  protected decodeJWT(): JwtTokenDecoded {
    const decode: JwtTokenDecoded = jwt_decode(this._token);
    return decode;
  }

  public formatDate = (date: string) => {
    //TODO format according to user settings
    const o = moment(date);
    return o.format('DD.MM.YYYY');
  };

  public formatDuration = (seconds: number, unit: 'h' | 'd' = 'h', showUnit = false) => {
    const renderedUnit = showUnit ? ' ' + unit : '';
    switch (unit) {
      case 'h':
        return Number(seconds / 60).toFixed(1) + renderedUnit;
      case 'd':
        return Number((seconds / 60) * 60).toFixed(1) + renderedUnit;
    }
  };

  public formatCurrency = (amount: number, showUnit = true) => (amount / 100).toFixed(2) + (showUnit ? ' CHF' : '');

  public displayInfo(message: string, options: OptionsObject = {}) {
    this.enqueueSnackbar(message, { variant: 'info', ...options });
  }

  public displaySuccess(message: string) {
    this.enqueueSnackbar(message, { variant: 'success' });
  }

  public displayError(message: string) {
    this.enqueueSnackbar(message, { variant: 'error' });
  }
}
