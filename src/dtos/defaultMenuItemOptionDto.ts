import { MenuItemOption } from '@entities/menuItemOption';
import {
  GetMenuItemOptionOutputDto,
  ListMenuItemOptionOutputDto,
} from './menuItemOptionDto';

export const defaultMenuItemOption: MenuItemOption = {
  id: '',
  menuItemId: '',
  title: '',
  position: 1,
  active: false,
  price: 0,
  createdAt: '',
  updatedAt: '',
};

export const defaultGetMenuItemOptionApiResponse: GetMenuItemOptionOutputDto = {
  item: defaultMenuItemOption,
};

export const defaultListMenuItemOptionApiResponse: ListMenuItemOptionOutputDto = {
  items: [],
  totalCount: 0,
  hasNext: false,
};
