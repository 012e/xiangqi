let baseURL = 'https://xiangqi-backend-e4f524a5a2ad.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:8080';
}

import Axios, {AxiosRequestConfig} from 'axios';

export const AXIOS_INSTANCE = Axios.create({baseURL: baseURL}); // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query

export const customInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();

    const promise = AXIOS_INSTANCE({
        ...config,

        ...options,

        cancelToken: source.token,
    }).then(({data}) => data);

    // @ts-ignore

    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};
