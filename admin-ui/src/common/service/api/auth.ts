import { LoginRequest } from "@/common/typings/auth";
import { request } from "../request";
import { SysMenu } from "@/common/typings/sys_menu";
export function fetchLogin(params: LoginRequest) {
  return request.post<{ data: { token: string, menu: SysMenu[] } }>("/admin/login", params);
}

