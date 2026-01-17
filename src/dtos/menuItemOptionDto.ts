import { MenuItemOption } from '@entities/menuItemOption';

export type ListMenuItemOptionInputDto = {
  menuItemId: string;
};

export type ListMenuItemOptionOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: MenuItemOption[];
};

export type GetMenuItemOptionInputDto = {
  id: string;
};

export type GetMenuItemOptionOutputDto = {
  item: MenuItemOption;
};

export type CreateMenuItemOptionInputDto = {
  menuItemId: string;
  title: string;
};

export type CreateMenuItemOptionOutputDto = {
  item: MenuItemOption;
};

export type DeleteMenuItemOptionInputDto = {
  id: string;
};

export type DeleteMenuItemOptionOutputDto = {
  success: boolean;
};

export type UpdateMenuItemOptionInputDto = {
  id: string;
  title?: string;
  active?: boolean;
  position?: number;
  price?: number;
};

export type UpdateMenuItemOptionOutputDto = {
  item: MenuItemOption;
};
