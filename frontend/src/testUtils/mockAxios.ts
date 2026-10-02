// Replacement for the axios instance created by ApiStore: no network access.
// Requests resolve with an empty page unless a response was registered with `mockApiResponse`.
// Use via `jest.mock('axios', () => require('<path>/testUtils/mockAxios').axiosMock)`.
interface MockResponse {
  data: unknown;
  status: number;
}

const emptyPage: MockResponse = { data: { data: [], meta: {} }, status: 200 };

const routes: { [url: string]: MockResponse } = {};

export const mockApiResponse = (url: string, data: unknown) => {
  routes[url] = { data, status: 200 };
};

// Called after every test (see setupTests.ts) so responses registered by one test never leak into the next.
export const resetApiResponses = () => {
  Object.keys(routes).forEach(url => delete routes[url]);
};

const respond = (url: string) => Promise.resolve(url in routes ? routes[url] : emptyPage);

const instance = {
  defaults: { headers: {} as { [key: string]: string } },
  interceptors: { request: { use: () => undefined }, response: { use: () => undefined } },
  get: (url: string) => respond(url),
  post: (url: string) => respond(url),
  put: (url: string) => respond(url),
  patch: (url: string) => respond(url),
  delete: (url: string) => respond(url),
};

export const axiosMock = {
  __esModule: true,
  default: { create: () => instance },
};
