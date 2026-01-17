import { MenuItem } from '@entities/menuItem';

export type ListMenuItemInputDto = {
  menuCategoryId: string;
};

export type ListMenuItemOutputDto = {
  hasNext: boolean;
  totalCount: number;
  items: MenuItem[];
};

export type GetMenuItemInputDto = {
  id: string;
};

export type GetMenuItemOutputDto = {
  item: MenuItem;
};

export type CreateMenuItemInputDto = {
  menuCategoryId: string;
  title: string;
};

export type CreateMenuItemOutputDto = {
  item: MenuItem;
};

export type DeleteMenuItemInputDto = {
  id: string;
};

export type DeleteMenuItemOutputDto = {
  success: boolean;
};

export type UpdateMenuItemInputDto = {
  id: string;
  title?: string;
  active?: boolean;
  position?: number;
  price?: number;
};

export type UpdateMenuItemOutputDto = {
  item: MenuItem;
};
