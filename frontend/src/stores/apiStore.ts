import * as Sentry from '@sentry/browser';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { History } from 'history';
import jwt_decode from 'jwt-decode';
import { action, computed, observable, runInAction } from 'mobx';
import moment from 'moment';

// this will be replaced by a build script, if necessary
const baseUrlOverride = 'BASE_URL';
export const baseUrl = baseUrlOverride.startsWith('http') ? baseUrlOverride : 'http://localhost:38000/api/v1';
export const baseUrlV2 = baseUrlOverride.startsWith('http') ? baseUrlOverride : 'http://localhost:38001/v1';

export const apiDateFormat = 'YYYY-MM-DD';

const KEY_TOKEN = 'dime_token';
const KEY_TOKEN_V2 = 'dime_token_V2';

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

export class ApiStore {

  @computed
  get token() {
    return this._token;
  }

  @computed
  get tokenV2() {
    return this._tokenV2;
  }

  get api() {
    return this._api;
  }

  get apiV2() {
    return this._apiV2;
  }

  @computed
  get isLoggedIn() {
    return Boolean(this._token) && Boolean(this._tokenV2) && moment.unix(this.userInfo!.exp).isAfter();
  }

  @computed
  get isAdmin(): boolean {
    return this.userInfo ? this.userInfo.is_admin : false;
  }

  @computed
  get meDetail(): JwtTokenDecoded['details'] | null {
    return this.userInfo ? this.userInfo.details : null;
  }

  @computed
  get userId(): number | undefined {
    return this.userInfo ? this.userInfo.sub : undefined;
  }

  @computed
  get userInfo(): JwtTokenDecoded | null {
    return this.token ? jwt_decode(this._token) : null;
  }

  private _api: AxiosInstance; // tslint:disable-line:variable-name
  private _apiV2: AxiosInstance; // tslint:disable-line:variable-name

  @observable
  private _token: string = ''; // tslint:disable-line:variable-name
  private _tokenV2: string = ''; // tslint:disable-line:variable-name

  constructor(private history: History) {
    this.restoreApiToken();
    this.updateSentryContext();
    this.initializeApiClient(this._token, this._tokenV2);
  }

  @action
  logout(redirect = true): void {
    localStorage.removeItem(KEY_TOKEN);
    this._token = '';
    this._tokenV2 = '';
    this.setAuthHeader(null);
    this.setAuthHeaderV2(null);
    if (redirect) {
      this.history.push('/');
    }
    this.updateSentryContext();
  }

  @action
  async postLogin(values: { email: string; password: string }) {
    const { email, password } = values;
    const data = { email, password };

    const resV2 = await this._apiV2.post<JwtToken>('employees/sign_in', { employee: data });
    const res = await this._api.post<JwtToken>('employees/login', data);

    // tslint:disable-next-line:no-console
    console.log('Response:', res);
    // tslint:disable-next-line:no-console
    console.log('ResponseV2:', resV2);

    runInAction(() => {
      this.setToken(res.data.token, resV2.headers.authorization);
      this.updateSentryContext();
    });
  }

  private restoreApiToken() {
    const token = localStorage.getItem(KEY_TOKEN);
    const tokenV2 = localStorage.getItem(KEY_TOKEN_V2);

    if (token) {
      this._token = token;
    }
    if (tokenV2) {
      this._tokenV2 = tokenV2;
    }
  }

  private initializeApiClient(token: string | null, tokenV2: string | null) {
    this._api = axios.create({ baseURL: baseUrl, headers: { Authorization: '' } });
    this._apiV2 = axios.create({ baseURL: baseUrlV2, headers: { Authorization: '' } });

    this.setAuthHeader(token);
    this.setAuthHeaderV2(tokenV2);

    const apis = [this._api, this._apiV2];

    for (const api of apis) {
      api.interceptors.response.use(
        response => {
          return response;
        },
        (error: AxiosError) => {
          // tslint:disable-next-line:no-console
          if (error.response && error.response.status === 401) {
            console.log('Unathorized API access, redirect to login'); // tslint:disable-line:no-console
            this.logout();
          }
          return Promise.reject(error);
        },
      );
    }
  }

  private setAuthHeader(token: string | null) {
    this._api.defaults.headers.Authorization = token ? 'Bearer ' + token : '';
    this._api.defaults.headers.Authorization = token ? 'Bearer ' + token : '';
  }

  private setAuthHeaderV2(token: string | null) {
    this._apiV2.defaults.headers.Authorization = token ? token : '';
  }

  private setToken(token: string, tokenV2: string) {
    this._token = token;
    this._tokenV2 = tokenV2;
    localStorage.setItem(KEY_TOKEN, token);
    localStorage.setItem(KEY_TOKEN_V2, tokenV2);
    this.setAuthHeader(token);
    this.setAuthHeaderV2(tokenV2);
  }

  private updateSentryContext() {
    if (this.isLoggedIn) {
      Sentry.configureScope(scope =>
        scope.setUser({
          id: String(this.userId),
          full_name: this.meDetail ? `${this.meDetail.first_name} ${this.meDetail.last_name}` : undefined,
        }),
      );
    } else {
      Sentry.configureScope(scope => scope.setUser({}));
    }
  }
}
