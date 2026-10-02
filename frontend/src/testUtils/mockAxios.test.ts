import { axiosMock, mockApiResponse } from './mockAxios';

const api = axiosMock.default.create();

describe('mockAxios', () => {
  it('returns a registered response', async () => {
    mockApiResponse('/projects/1', { id: 1 });

    expect((await api.get('/projects/1')).data).toEqual({ id: 1 });
  });

  it('falls back to an empty page for unregistered urls', async () => {
    expect((await api.get('/unknown')).data).toEqual({ data: [], meta: {} });
  });

  it('does not leak responses registered in an earlier test', async () => {
    // '/projects/1' was registered in the first test; setupTests resets it after each test
    expect((await api.get('/projects/1')).data).toEqual({ data: [], meta: {} });
  });
});
