let baseURL = 'https://xiangqi-backend-e4f524a5a2ad.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:8080';
}

import useSettingStore from '@/stores/setting-store';
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: baseURL }); // use your own URL here or environment variable

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // Add authorization token to headers if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AXIOS_INSTANCE.interceptors.request.use(
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

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
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
