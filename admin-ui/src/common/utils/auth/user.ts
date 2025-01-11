import { sessionCache, localCache } from "../store";
import { SysMenu } from "@/common/typings/sys_menu";

export function getToken() {
  return sessionCache.getCache<string>("__TOKEN__") || "";
}

export function setToken(data: string) {
  return sessionCache.setCache("__TOKEN__", data);
}

export function removeToken() {
  sessionCache.removeCache("__TOKEN__");
}

export function setMenu(data: SysMenu[]) {
  return localCache.setCache("menu", data);
}

export function getMenu() {
  return localCache.getCache<SysMenu[]>("menu") || [];
}
