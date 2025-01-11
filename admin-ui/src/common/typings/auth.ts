
import type { MenuProps } from "antd";

import { ReactElement } from "react";

export interface LoginRequest {
  [k: string]: string;
  username: string;
  password: string;
}
export interface User {
  name: string;
  age: string | number;
  tel: string;
  token: string;
}
export type MenuItem = Required<MenuProps>["items"][number];
export interface Menu {
  label: string;
  path: string;
  key?: string;
  icon?: string;
  page?: string;
  children?: Menu[];
}
export interface MenuIcon {
  label: string;
  path: string;
  key?: string;
  icon?: ReactElement;
  children?: Menu[];
}
export interface ResponseMenu {
  list: Menu[];
}
