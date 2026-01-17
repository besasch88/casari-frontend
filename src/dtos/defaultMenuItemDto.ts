import { MenuItem } from '@entities/menuItem';
import { GetMenuItemOutputDto, ListMenuItemOutputDto } from './menuItemDto';

export const defaultMenuItem: MenuItem = {
  id: '',
  menuCategoryId: '',
  title: '',
  position: 1,
  active: false,
  price: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultGetMenuItemApiResponse: GetMenuItemOutputDto = {
  item: defaultMenuItem,
};

export const defaultListMenuItemApiResponse: ListMenuItemOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
