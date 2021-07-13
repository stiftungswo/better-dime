import * as Sentry from '@sentry/browser';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { History } from 'history';
import jwt_decode from 'jwt-decode';
import { action, computed, observable, runInAction } from 'mobx';
import moment from 'moment';

// this will be replaced by a build script, if necessary
const baseApirUrlOverride = 'BASE_APIR_URL'; // ruby API
export const baseUrlV2 = baseApirUrlOverride.startsWith('http') ? baseApirUrlOverride : 'http://localhost:38001/v2';

export const apiDateFormat = 'YYYY-MM-DD';

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
  get tokenV2() {
    return this._tokenV2;
  }

  get apiV2() {
    return this._apiV2;
  }

  @computed
  get isLoggedIn() {
    return Boolean(this._tokenV2) && moment.unix(this.userInfo!.exp).isAfter();
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
    return this.tokenV2 ? jwt_decode(this._tokenV2) : null;
  }

  private _apiV2: AxiosInstance; // tslint:disable-line:variable-name

  @observable
  private _tokenV2: string = ''; // tslint:disable-line:variable-name

  constructor(private history: History) {
    this.restoreApiToken();
    this.updateSentryContext();
    this.initializeApiClient(this._tokenV2);
  }

  @action
  logout(redirect = true): void {
    localStorage.removeItem(KEY_TOKEN_V2);
    this._tokenV2 = '';
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

    // tslint:disable-next-line:no-console
    console.log("Url: ", baseUrlV2);

    const resV2 = await this._apiV2.post<JwtToken>('employees/sign_in', { employee: data });

    // tslint:disable-next-line:no-console
    console.log('ResponseV2:', resV2);

    runInAction(() => {
      this.setToken(resV2.headers.authorization);
      this.updateSentryContext();
    });
  }

  private restoreApiToken() {
    const tokenV2 = localStorage.getItem(KEY_TOKEN_V2);

    if (tokenV2) {
      this._tokenV2 = tokenV2;
    }
  }

  private initializeApiClient(tokenV2: string | null) {
    this._apiV2 = axios.create({ baseURL: baseUrlV2, headers: { Authorization: '' } });

    this.setAuthHeaderV2(tokenV2);

    const api = this._apiV2;

    // NEXT TIME LOGIN FAILS TRY HERE

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

  private setAuthHeaderV2(token: string | null) {
    this._apiV2.defaults.headers.Authorization = token ? token : '';
  }

  private setToken(tokenV2: string) {
    this._tokenV2 = tokenV2;
    localStorage.setItem(KEY_TOKEN_V2, tokenV2);
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
