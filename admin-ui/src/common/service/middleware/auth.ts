import type { MenuItem, ResponseMenu, Menu } from "@/common/typings/auth";

export function fetchMenuMiddleware(data: ResponseMenu): MenuItem[] {
  const { list } = data;
  list.forEach((item: Menu) => {
    if (item?.children && item?.children.length) {
      item.children.forEach((child) => {
        child.key = child.path;
      });
    }
    item.key = item.path;
  });
  return list as MenuItem[];
}
