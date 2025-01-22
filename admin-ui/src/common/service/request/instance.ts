import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  CancelTokenStatic,
} from "axios";
import {
  transformRequestData,
  handleAxiosError,
  handleResponseError,
  handleBackendError,
} from "@/common/utils/service";
import type { BackendServiceResult } from "@/common/typings/service";
import { getToken, removeToken } from "@/common/utils/auth";

export default class RequestInstance {
  instance: AxiosInstance;
  private backendSuccessCode = 200;
  cancelToken: CancelTokenStatic;
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.cancelToken = axios.CancelToken;
    this.setInterceptor();
  }
  setInterceptor() {
    this.instance.interceptors.request.use(
      async (config) => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers["Content-Type"] as string;
          handleConfig.data = await transformRequestData(
            handleConfig.data,
            contentType,
          );
          // 设置token
          handleConfig.headers.Authorization = getToken();
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { status } = response;
        if (status === 200 || status < 300 || status === 304) {
          const backendServiceResult = response.data as BackendServiceResult;
          if (backendServiceResult.code === this.backendSuccessCode) {
            return Promise.resolve(response.data);
          }
          if (backendServiceResult.code === 401) {
            //退出登录
            removeToken();
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }

          const error = handleBackendError(backendServiceResult);
          return Promise.reject(error);
        }
        const error = handleResponseError(response);
        return Promise.reject(error);
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return Promise.reject(error);
      },
    );
  }
}
