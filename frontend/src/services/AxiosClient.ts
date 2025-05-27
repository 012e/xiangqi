let baseURL = 'https://xiangqi-backend-e4f524a5a2ad.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:8080';
}

import useSettingStore from '@/stores/setting-store';
import Axios, { AxiosRequestConfig } from 'axios';

export const appAxios = Axios.create({ baseURL: baseURL }); // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query
appAxios.interceptors.request.use(
  (config) => {
    const backendUrl = useSettingStore.getState().backendUrl;
    if (backendUrl) {
      config.baseURL = backendUrl;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

appAxios.interceptors.request.use(
  (config) => {
    const token = useSettingStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = appAxios({
    ...config,

    ...options,

    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
