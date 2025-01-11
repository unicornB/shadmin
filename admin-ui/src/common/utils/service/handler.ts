import {
  CustomRequestResult,
  RequestSuccessResult,
  RequestFailResult,
} from "@/common/typings/service";

type ResultHandler<T> = (...arg: any) => T;
/**
 * 对请求的结果数据进行格式化的处理
 * @param resultHandler - 处理函数
 * @param requests - 请求结果
 */
export function requestMiddleware<MiddlewareData>(
  resultHandler: ResultHandler<MiddlewareData>,
  requests: CustomRequestResult<any>[],
) {
  console.log("requestMiddleware", requests);
  const errorIndex = requests.findIndex((item) => item.error !== null);
  const hasError = errorIndex > -1;
  if (hasError) {
    const failResult: RequestFailResult = {
      data: null,
      error: requests[errorIndex].error!,
    };
    return failResult;
  }
  const successResult: RequestSuccessResult<MiddlewareData> = {
    data: resultHandler(...requests.map((item) => item.data)),
    error: null,
    msg: "success"
  };
  return successResult;
}
