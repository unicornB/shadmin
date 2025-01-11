import { message } from "antd";
import type { RequestServiceError } from "@/common/typings/service";
import { NO_ERROR_MSG_CODES, ERROR_MSG_DURATION } from "@/common/config/service";

/** 错误消息栈，防止同一错误同时出现 */
const errorMsgStack = new Map<string | number, string>([]);

function addErrorMsg(error: RequestServiceError) {
  errorMsgStack.set(error.code, error.msg);
}
function removeErrorMsg(error: RequestServiceError) {
  errorMsgStack.delete(error.code);
}
function hasErrorMsg(error: RequestServiceError) {
  return errorMsgStack.has(error.code);
}

/**
 * 显示错误信息
 * @param error
 */
export function showErrorMsg(error: RequestServiceError) {
  if (!error.msg) return;
  if (!NO_ERROR_MSG_CODES.includes(error.code)) {
    if (!hasErrorMsg(error)) {
      addErrorMsg(error);
      message.error({
        content: error.msg,
        duration: ERROR_MSG_DURATION / 1000,
      });
      setTimeout(() => {
        removeErrorMsg(error);
      }, ERROR_MSG_DURATION);
    }
  }
}
