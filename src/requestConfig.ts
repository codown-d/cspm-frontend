import { getLocale, history, proxy } from '@umijs/max';
import { message } from 'antd';
import { first, get, isArray, keys, set } from 'lodash';
import * as NProgress from 'nprogress';
import queryString from 'query-string';
import { AxiosCanceler } from './axiosCancel';
import translate from './locales/translate';
import { storage } from './utils/tzStorage';

type requestStoreProps = { url?: string; timestamp: number };
const requestStoreAction = (url: string) => {
  const curTime = +new Date();
  if (curTime - requestStore.timestamp > 1000) {
    requestStore.url = url;
    requestStore.timestamp = curTime;
  }
};

export const requestStore = proxy<requestStoreProps>({
  url: undefined,
  timestamp: 0,
});

NProgress.configure({
  easing: 'linear',
  speed: 350,
  showSpinner: false,
});
const codeMessage: Record<number, string> = {
  200: translate('request.code.200'),
  201: translate('request.code.201'),
  202: translate('request.code.202'),
  204: translate('request.code.204'),
  400: translate('request.code.400'),
  401: translate('request.code.401'),
  403: translate('request.code.403'),
  404: translate('request.code.404'),
  406: translate('request.code.406'),
  410: translate('request.code.410'),
  422: translate('request.code.422'),
  500: translate('request.code.500'),
  502: translate('request.code.502'),
  503: translate('request.code.503'),
  504: translate('request.code.504'),
};

const axiosCanceler = new AxiosCanceler();

const errorHandler = (error: any) => {
  const { response } = error ?? {};
  if (response?.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    const errorTxt = `${(response?.data as any)?.message || errorText}`;
    if (typeof response?.data !== 'string') {
      if ([401, 503].includes(status)) {
        storage.remove('userInfo');
        storage.removeCookie('token');
        status === 401 && history.replace('/login');
        status === 503 && history.replace('/503');
      }

      message.error({
        key: status === 401 ? status : +new Date(),
        content: errorTxt,
      });
      return response;
    }
    message.error({
      key: first(`${response.status}`) === '5' ? status : +new Date(),
      content: errorTxt,
    });
  } else if (!response) {
    // console.log(response);
    // message.error(translate('request.errorTip'));
  }
  return response;
};
const requestInterceptors = (request: {
  isSignal?: boolean;
  headers: { Authorization: string };
}) => {
  request.isSignal && axiosCanceler.addPending(request);
  // console.log(request);

  const token = storage.getCookie('token');
  const lang = getLocale();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  const contentType = get(request, ['headers', 'Content-Type']);
  !contentType && set(request, ['headers', 'Content-Type'], 'application/json');
  // set(request, ['headers', 'Accept-Language'], lang === EN_LANG ? 'en' : 'zh');
  NProgress.start();
  return request;
};
const responseInterceptors = (response: any) => {
  response.config.isSignal && axiosCanceler.removePending(response.config);
  requestStoreAction(response.config.url);
  NProgress.done();
  const {
    data,
    config: { customHandleRes },
  } = response;

  if (customHandleRes) {
    return response;
  }
  const { code } = data;
  // todo ！！！！！！！！
  // return response.data;
  if (!code) {
    return response.data;
  }
  return Promise.reject(response);
};

export const requestConfig = {
  paramsSerializer(params: any) {
    const newParams = {};
    keys(params)?.forEach((key) =>
      set(
        newParams,
        key,
        isArray(params[key]) && !params[key].length ? '' : params[key],
      ),
    );
    return queryString.stringify(newParams);
  },
  errorConfig: {
    errorHandler,
  },
  retryTimes: 3, // 重发次数
  timeout: 100 * 1000,
  baseURL: process.env.PUBLIC_URL,
  // 请求拦截器
  requestInterceptors: [requestInterceptors],

  // 响应拦截器
  responseInterceptors: [
    [
      responseInterceptors,
      (error: any) => {
        const { config, response } = error;
        NProgress.done();

        if (!config?.skipErrorHandler) {
          errorHandler(error);
        }
        return Promise.reject(response?.data);
      },
    ],
  ],
};
