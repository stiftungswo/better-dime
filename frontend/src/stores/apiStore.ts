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

  get api() {
    return this._api;
  }

  get apiV2() {
    return this._apiV2;
  }

  @computed
  get isLoggedIn() {
    return Boolean(this._token) && moment.unix(this.userInfo!.exp).isAfter();
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
    this.initializeApiClient(this._token);
  }

  @action
  logout(redirect = true): void {
    localStorage.removeItem(KEY_TOKEN);
    this._token = '';
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

    this.setAuthHeaderV2(null);
    // tslint:disable-next-line:no-console
    console.log('We had the header: ', this._apiV2.defaults.headers.Authorization);
    const resV2 = await this._apiV2.post<JwtToken>('employees/sign_in', {
      employee: {
        email,
        password,
      },
    });
    const res = await this._api.post<JwtToken>('employees/login', {
      email,
      password,
    });
    runInAction(() => {
      this.setToken(res.data.token);
      this.updateSentryContext();
    });
    // tslint:disable-next-line:no-console
    console.log('We have got the rails response: ', resV2);
  }

  private restoreApiToken() {
    const token = localStorage.getItem(KEY_TOKEN);
    if (token) {
      this._token = token;
    }
  }

  private initializeApiClient(token: string | null) {
    this._api = axios.create({
      baseURL: baseUrl,
    });
    this._apiV2 = axios.create({
      baseURL: baseUrlV2,
    });
    this.setAuthHeader(token);

    this._api.interceptors.response.use(
      response => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          console.log('Unathorized API access, redirect to login'); // tslint:disable-line:no-console
          this.logout();
        }
        return Promise.reject(error);
      },
    );

    this._apiV2.interceptors.response.use(
      response => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          console.log('Unathorized API access, redirect to login'); // tslint:disable-line:no-console
          this.logout();
        }
        return Promise.reject(error);
      },
    );
  }

  private setAuthHeader(token: string | null) {
    this._api.defaults.headers.Authorization = token ? 'Bearer ' + token : '';
  }

  private setAuthHeaderV2(token: string | null) {
    this._apiV2.defaults.headers.Authorization = token ? 'Bearer ' + token : '';
  }

  private setToken(token: string) {
    this._token = token;
    localStorage.setItem(KEY_TOKEN, token);
    this.setAuthHeader(token);
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
